export BILLING_ID="$(gcloud beta billing accounts list --format=json | jq -r '.[0].name[16:]')"

gcloud projects create ${GOOGLE_CLOUD_PROJECT} \
  --name="${PROJECT_NAME}" \
  --set-as-default
gcloud beta billing projects link ${GOOGLE_CLOUD_PROJECT} \
  --billing-account="${BILLING_ID}"

gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbilling.googleapis.com
gcloud services enable cloudsql.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable storage-component.googleapis.com
gcloud services enable compute.googleapis.com
