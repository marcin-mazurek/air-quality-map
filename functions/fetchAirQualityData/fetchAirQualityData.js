const fetchNearbyStations = require('./fetchNearbyStations');
const fetchStationDataAndStoreToDB = require('./fetchStationDataAndStoreToDB');

module.exports = async () => {
  let nearbyStations;

  try {
    nearbyStations = await fetchNearbyStations();
  } catch (e) {
    return {
      statusCode: 500
    };
  }

  const fetchStationDataTasks = [];

  for (const station of nearbyStations) {
    fetchStationDataTasks.push(fetchStationDataAndStoreToDB(station.id));
  }

  await Promise.all(fetchStationDataTasks);

  return {
    statusCode: 200
  };
};
