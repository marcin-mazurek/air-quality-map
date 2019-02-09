const fetch = require('isomorphic-fetch');

module.exports = async (lat, lng, radius, limit = -1) => {
  const url = process.env.AIRLY_API_BASE_URL + `/installations/nearest?lat=${lat}&lng=${lng}&maxDistanceKM=${radius}&maxResults=${limit}`;

  console.log(`Making request to ${url}`);

  const response = await fetch(url, { headers: { apikey: process.env.AIRLY_API_KEY }});

  console.log(`${url} responded with ${response.status} ${response.statusText}. ` +
    `Requests remaining: ${response.headers.get('x-ratelimit-remaining-day')} today, ${response.headers.get('x-ratelimit-remaining-minute')} this minute.`);

  if (!response.ok) {
    throw new Error(`Airly API responded with ${response.status} ${response.statusText}`);
  }

  return await response.json();
}