const fetch = require('isomorphic-fetch');

module.exports = async (id) => {
  const url = process.env.AIRLY_API_BASE_URL + `/measurements/installation?installationId=${id}`;

  console.log(`Making request to ${url}`);

  const response = await fetch(url, { headers: { apikey: process.env.AIRLY_API_KEY }});

  console.log(`${url} responded with ${response.status} ${response.statusText}. ` +
    `Requests remaining: ${response.headers.get('x-ratelimit-remaining-day')} today, ${response.headers.get('x-ratelimit-remaining-minute')} this minute.`);

  return await response.json();
}