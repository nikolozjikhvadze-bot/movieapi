const Movie = require('../models/Movie');
const omdbAPI = require('../utils/omdbAPI');
// @desc    Search movies from OMDB and optionally save to DB
// @route   GET /api/movies/search
// @access  Public
exports.searchMovies = async (req, res, next) => {
try {
const { query, page = 1, save = false } = req.query;
if (!query) {
return res.status(400).json({
success: false,
message: 'Please provide a search query'
});
}
const result = await omdbAPI.searchMovies(query, page);
// Optionally save movies to database
if (save === 'true') {
for (const movie of result.movies) {
await Movie.findOneAndUpdate(
{ imdbID: movie.imdbID },
{
imdbID: movie.imdbID,
title: movie.Title,
year: movie.Year,
poster: movie.Poster,
type: movie.Type
},
{ upsert: true, new: true }
);
}
}
    res.status(200).json({
success: true,
count: result.movies.length,
totalResults: result.totalResults,
data: result.movies
});
} catch (error) {
next(error);
}
};
// @desc    Get movie details by IMDb ID and save to DB
// @route   GET /api/movies/imdb/:imdbId
// @access  Public
exports.getMovieByImdbId = async (req, res, next) => {
try {
const { imdbId } = req.params;
// Check if movie exists in DB
let movie = await Movie.findOne({ imdbID: imdbId });
// If not in DB, fetch from OMDB and save
if (!movie) {
const movieData = await omdbAPI.getMovieByImdbId(imdbId);
      movie = await Movie.create(movieData);
} else {
// Increment views
await movie.incrementViews();
}
    res.status(200).json({
success: true,
data: movie
});
} catch (error) {
next(error);
}
};
// @desc    Get all movies from database
// @route   GET /api/movies
// @access  Public
exports.getAllMovies = async (req, res, next) => {
try {
const { page = 1, limit = 10, genre, year, type } = req.query;
// Build filter
const filter = {};
if (genre) filter.genre = genre;
if (year) filter.year = year;
if (type) filter.type = type;
const movies = await Movie.find(filter)
.limit(limit * 1)
.skip((page - 1) * limit)
.sort({ createdAt: -1 })
.select('-__v');
const count = await Movie.countDocuments(filter);
    res.status(200).json({
success: true,
count: movies.length,
totalPages: Math.ceil(count / limit),
currentPage: page,
data: movies
});
} catch (error) {
next(error);
}
};
// @desc    Get single movie by database ID
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res, next) => {
try {
const movie = await Movie.findById(req.params.id)
.populate('favoritedBy', 'username email');
if (!movie) {
return res.status(404).json({
success: false,
message: 'Movie not found'
});
}
await movie.incrementViews();
    res.status(200).json({
success: true,
data: movie
});
} catch (error) {
next(error);
}
};
// @desc    Get popular movies (most favorited)
// @route   GET /api/movies/popular
// @access  Public
exports.getPopularMovies = async (req, res, next) => {
try {
const movies = await Movie.aggregate([
{
$addFields: {
favoriteCount: { $size: '$favoritedBy' }
}
},
{
$sort: { favoriteCount: -1, views: -1 }
},
{
$limit: 10
}
]);
    res.status(200).json({
success: true,
count: movies.length,
data: movies
});
} catch (error) {
next(error);
}
};
// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin only - implement later)
exports.deleteMovie = async (req, res, next) => {
try {
const movie = await Movie.findById(req.params.id);
if (!movie) {
return res.status(404).json({
success: false,
message: 'Movie not found'
});
}
await movie.deleteOne();
    res.status(200).json({
success: true,
message: 'Movie deleted successfully',
data: {}
});
} catch (error) {
next(error);
}
};
// @desc    Text search movies
// @route   GET /api/movies/text-search
// @access  Public
exports.textSearch = async (req, res, next) => {
try {
const { q } = req.query;
if (!q) {
return res.status(400).json({
success: false,
message: 'Please provide a search term'
});
}
const movies = await Movie.find(
{ $text: { $search: q } },
{ score: { $meta: 'textScore' } }
)
.sort({ score: { $meta: 'textScore' } })
.limit(20);
    res.status(200).json({
success: true,
count: movies.length,
data: movies
});
} catch (error) {
next(error)
}
};