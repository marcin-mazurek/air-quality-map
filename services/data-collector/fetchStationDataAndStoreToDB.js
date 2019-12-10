const uuid = require('uuid');
const fetchStationData = require('./fetchStationData');

module.exports = stationId => {
  return new Promise(async (resolve) => {
    let stationData;

    try {
      stationData = await fetchStationData(stationId);
    } catch (e) {
      console.error(`Failed to fetch data for ${stationId} station. Original error: ` + e);
      return;
    }

    console.log({
      history: stationData.history,
      id: uuid.v1(),
      stationId: stationId,
    });

    resolve();
  });
};