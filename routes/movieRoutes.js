const express = require('express');
const router = express.Router();
const {
  searchMovies,
  getMovieByImdbId,
  getAllMovies,
  getMovie,
  getPopularMovies,
  deleteMovie,
  textSearch
} = require('../controllers/movieController');
// Search and retrieve routes
router.get('/search', searchMovies);
router.get('/text-search', textSearch);
router.get('/popular', getPopularMovies);
router.get('/imdb/:imdbId', getMovieByImdbId);
router.get('/', getAllMovies);
router.get('/:id', getMovie);
// Delete route
router.delete('/:id', deleteMovie);
module.exports = router;