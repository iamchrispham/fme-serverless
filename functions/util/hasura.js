const fetch = require('node-fetch');
const env = require("dotenv").config()

async function query({ query, variables = {} }) {
  const result = await fetch(process.env.HASURA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  }).then((response) => response.json());

  // TODO send back helpful information if there are errors
  // console.log('*HASURA:', result.data);
  return result.data;
}

exports.query = query;
