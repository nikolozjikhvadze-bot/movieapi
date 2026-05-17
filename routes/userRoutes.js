const express = require('express');
const router = express.Router();
const {
  createUser,
  getUser,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  markAsWatched
} = require('../controllers/userController');
// User CRUD
router.post('/', createUser);
router.get('/:id', getUser);
// Favorites
router.post('/:userId/favorites/:movieId', addToFavorites);
router.delete('/:userId/favorites/:movieId', removeFromFavorites);
// Watchlist
router.post('/:userId/watchlist', addToWatchlist);
router.patch('/:userId/watchlist/:movieId', markAsWatched);
module.exports = router;