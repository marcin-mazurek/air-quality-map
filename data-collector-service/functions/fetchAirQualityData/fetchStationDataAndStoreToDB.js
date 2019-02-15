const uuid = require('uuid');
const AWS = require('aws-sdk');
const fetchStationData = require('./fetchStationData');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = stationId => {
  return new Promise(async (resolve, reject) => {
    let stationData;

    try {
      stationData = await fetchStationData(stationId);
    } catch (e) {
      console.error(`Failed to fetch data for ${stationId} station. Original error: ` + e);
      return;
    }

    dynamoDb.put(
      {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          history: stationData.history,
          id: uuid.v1(),
          stationId: stationId,
        },
      },
      error => {
        if (error) {
          console.error(`Failed to save data for ${stationId} station. Original error: ` + error);
          reject();
        } else {
          console.log(`Successfully saved data for ${stationId} station`);
          resolve();
        }
      }
    );
  });
};