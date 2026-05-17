const axios = require('axios');
const OMDB_BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY;
class OMDBService {
// Search movies by title
async searchMovies(query, page = 1) {
try {
const response = await axios.get(OMDB_BASE_URL, {
params: {
apikey: API_KEY,
s: query,
page: page
}
});
if (response.data.Response === 'False') {
throw new Error(response.data.Error);
}
return {
movies: response.data.Search,
totalResults: response.data.totalResults
};
} catch (error) {
throw new Error(`OMDB API Error: ${error.message}`);
}
}
// Get movie by IMDb ID
async getMovieByImdbId(imdbId) {
try {
const response = await axios.get(OMDB_BASE_URL, {
params: {
apikey: API_KEY,
i: imdbId,
plot: 'full'
}
});
if (response.data.Response === 'False') {
throw new Error(response.data.Error);
}
return this.formatMovieData(response.data);
} catch (error) {
throw new Error(`OMDB API Error: ${error.message}`);
}
}
// Get movie by title
async getMovieByTitle(title, year = null) {
try {
const params = {
apikey: API_KEY,
t: title,
plot: 'full'
};
if (year) params.y = year;
const response = await axios.get(OMDB_BASE_URL, { params });
if (response.data.Response === 'False') {
throw new Error(response.data.Error);
}
return this.formatMovieData(response.data);
} catch (error) {
throw new Error(`OMDB API Error: ${error.message}`);
}
}
// Format movie data to match our schema
formatMovieData(data) {
return {
imdbID: data.imdbID,
title: data.Title,
year: data.Year,
rated: data.Rated,
released: data.Released,
runtime: data.Runtime,
genre: data.Genre ? data.Genre.split(', ') : [],
director: data.Director,
writer: data.Writer,
actors: data.Actors ? data.Actors.split(', ') : [],
 plot: data.Plot,
      language: data.Language,
      country: data.Country,
      poster: data.Poster,
      ratings: data.Ratings || [],
      imdbRating: data.imdbRating,
      imdbVotes: data.imdbVotes,
      type: data.Type,
      totalSeasons: data.totalSeasons
    };
  }
}
module.exports = new OMDBService();