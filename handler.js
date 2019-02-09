const AWS = require('aws-sdk');

const fetchAirQualityData = require('./functions/fetchAirQualityData');

module.exports.fetchAirQualityData = fetchAirQualityData;