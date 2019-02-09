const uuid = require('uuid');
const AWS = require('aws-sdk');
const fetchNearbyStations = require('./fetchNearbyStations');
const fetchStationData = require('./fetchStationData');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async () => {
  let nearbyStations;

  try {
    nearbyStations = await fetchNearbyStations(
      process.env.LOCATION_SEARCH_LAT,
      process.env.LOCATION_SEARCH_LNG,
      process.env.LOCATION_SEARCH_RADIUS,
      process.env.LOCATION_SEARCH_LIMIT,
    );
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500
    };
  }

  for (const station of nearbyStations) {
    let stationData;

    try {
      stationData = await fetchStationData(station.id);
    } catch (e) {
      console.error(`Failed to fetch data for ${stationData} station. Original error: ` + e);
      continue;
    }

    try {
      await dynamoDb.put({
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          history: stationData.history,
          id: uuid.v1(),
          stationId: station.id,
        },
      });

      console.log(`Successfully saved data for ${station.id} station`);
    } catch (e) {
      console.error('Failed to save data for ${station.id} station. Original error: ' + e);
      continue;
    }
  }

  return {
    statusCode: 200
  };
};
