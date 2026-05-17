const User = require('../models/User');
const Movie = require('../models/Movie');
// @desc    Create new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res, next) => {
try {
const { username, email } = req.body;
// Check if user exists
const existingUser = await User.findOne({ $or: [{ email }, { username }] });
if (existingUser) {
return res.status(400).json({
success: false,
message: 'User already exists'
});
}
const user = await User.create({ username, email });
    res.status(201).json({
success: true,
data: user
});
} catch (error) {
next(error);
}
};
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
try {
const user = await User.findById(req.params.id)
.populate('favorites', 'title year poster imdbRating')
.populate('watchlist.movieId', 'title year poster');
if (!user) {
return res.status(404).json({
success: false,
message: 'User not found'
});
}
 res.status(200).json({
success: true,
data: user
});
} catch (error) {
next(error);
}
};
// @desc    
//Add movie to favorites
// @route   POST /api/users/:userId/favorites/:movieId
// @access  Public
exports.addToFavorites = async (req, res, next) => {
try {
const { userId, movieId } = req.params;
const user = await User.findById(userId);
const movie = await Movie.findById(movieId);
if (!user || !movie) {
return res.status(404).json({
success: false,
message: 'User or Movie not found'
});
}
await user.addToFavorites(movieId);
// Add user to movie's favoritedBy array
if (!movie.favoritedBy.includes(userId)) {
      movie.favoritedBy.push(userId);
await movie.save();
}
    res.status(200).json({
success: true,
message: 'Movie added to favorites',
data: user
});
} catch (error) {
next(error);
}
};
// @desc    Remove movie from favorites
// @route   DELETE /api/users/:userId/favorites/:movieId
// @access  Public
exports.removeFromFavorites = async (req, res, next) => {
try {
const { userId, movieId } = req.params;
const user = await User.findById(userId);
const movie = await Movie.findById(movieId);
if (!user || !movie) {
return res.status(404).json({
success: false,
message: 'User or Movie not found'
});
}
await user.removeFromFavorites(movieId);
// Remove user from movie's favoritedBy array
    movie.favoritedBy = movie.favoritedBy.filter(
id => id.toString() !== userId
);
await movie.save();
    res.status(200).json({
success: true,
message: 'Movie removed from favorites',
data: user
});
} catch (error) {
next(error);
}
};
// @desc    
//Add movie to watchlist
// @route   POST /api/users/:userId/watchlist
// @access  Public
exports.addToWatchlist = async (req, res, next) => {
try {
const { userId } = req.params;
const { movieId } = req.body;
const user = await User.findById(userId);
if (!user) {
return res.status(404).json({
success: false,
message: 'User not found'
});
}
// Check if already in watchlist
const exists = user.watchlist.some(
item => item.movieId.toString() === movieId
);
if (exists) {
return res.status(400).json({
success: false,
message: 'Movie already in watchlist'
});
}
    user.watchlist.push({ movieId });
await user.save();
await user.populate('watchlist.movieId', 'title year poster');
    res.status(200).json({
success: true,
message: 'Movie added to watchlist',
data: user
});
} catch (error) {
next(error);
}
};
// @desc    Mark movie as watched in watchlist
// @route   PATCH /api/users/:userId/watchlist/:movieId
// @access  Public
exports.markAsWatched = async (req, res, next) => {
try {
 const { userId, movieId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const watchlistItem = user.watchlist.find(
      item => item.movieId.toString() === movieId
    );
    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Movie not in watchlist'
      });
    }
    watchlistItem.watched = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Movie marked as watched',
      data: user
    });
  } catch (error) {
    next(error);
  }
};