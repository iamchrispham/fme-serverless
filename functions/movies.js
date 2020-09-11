const { URL } = require('url');
const fetch = require('node-fetch');
const { query } = require('./util/hasura');
const env = require("dotenv").config()

exports.handler = async () => {
  const { movies } = await query({
    query: `
      query {
        movies {
          id
          title
          tagline
          poster
        }
      }
    `,
  });

  // const api = new URL('https://correct-iguana-69.hasura.app/v1/graphql');

  // // add the secret API key to the query string
  // api.searchParams.set('apikey', process.env.HASURA_ADMIN_SECRET);
  const api = new URL('https://www.omdbapi.com/');

  // add the secret API key to the query string
  api.searchParams.set('apikey', process.env.OMDB_API_KEY);

  const promises = movies.map((movie) => {
    // use the movie’s IMDb/OMDb ID to look up details
    api.searchParams.set('i', movie.id);

    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        // console.log('*Data: ',data);
        // console.log('API KEY: ', process.env.OMDB_API_KEY);
        const scores = data.Ratings;

        return {
          ...movie,
          scores,
        };
      });
  });

  // awaiting all Promises lets the requests happen in parallel
  // see: https://lwj.dev/blog/keep-async-await-from-blocking-execution/
  const moviesWithRatings = await Promise.all(promises);

  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings),
  };
};
