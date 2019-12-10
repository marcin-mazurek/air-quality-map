variable "env" {
  type = string
  default = "dev"
}

provider "google" {
  credentials = file("../service-account-${var.env}.json")
  project     = "ybeta-air-quality-map-${var.env}"
  region      = "europe-west1"
  zone        = "europe-west1-b"
}

resource "google_compute_network" "network" {
  name = "network-${var.env}"
}

resource "google_compute_global_address" "database_ip_address" {
  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.network.self_link
}

resource "google_service_networking_connection" "database_vpc_connection" {
  network                 = google_compute_network.network.self_link
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.database_ip_address.name]
}

resource "google_sql_database_instance" "database" {
  name                 = "air-quality-data"
  database_version     = "POSTGRES_11"
  depends_on           = [google_service_networking_connection.database_vpc_connection]

  settings {
    tier = "db-f1-micro"
  
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.network.self_link
    }
  }
}

resource "google_storage_bucket" "services_source_code" {
  name = "services-source-code"
}

resource "google_storage_bucket_object" "data_collector_service_source_code" {
  bucket = google_storage_bucket.services_source_code.name
  name   = "latest.zip"
  source = "./data-collector-service"
}

resource "google_pubsub_topic" "fetch_air_quality_data" {
  name = "fetch-air-quality-data"
}

resource "google_cloudfunctions_function" "data_collector_service" {
  name        = "data-collector-service"
  description = "Data Collector Service"
  runtime     = "nodejs10"

  event_trigger         = google_pubsub_topic.fetch_air_quality_data.id
  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.services_source_code.name
  source_archive_object = google_storage_bucket_object.data_collector_service_source_code.name
}

resource "google_cloud_scheduler_job" "airly_fetch_trigger" {
  name        = "airly-fetch-trigger"
  description = "Triggers fetching data from Airly"
  schedule    = "0 23 * * *"
  time_zone   = "Europe/Warsaw"

  pubsub_target {
    topic_name = google_pubsub_topic.fetch_air_quality_data.id
    data       = base64encode("fetch")
  }
}

