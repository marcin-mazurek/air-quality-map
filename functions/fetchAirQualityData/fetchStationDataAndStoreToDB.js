const uuid = require('uuid');
const AWS = require('aws-sdk');
const fetchStationData = require('./fetchStationData');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async stationId => {
  let stationData;

  try {
    stationData = await fetchStationData(stationId);
  } catch (e) {
    console.error(`Failed to fetch data for ${stationId} station. Original error: ` + e);
    return;
  }

  try {
    await dynamoDb.put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        history: stationData.history,
        id: uuid.v1(),
        stationId: stationId,
      },
    });

    console.log(`Successfully saved data for ${stationId} station`);
  } catch (e) {
    console.error(`Failed to save data for ${stationId} station. Original error: ` + e);
    return;
  }
};