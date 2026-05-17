const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
{
imdbID: {
type: String,
required: true,
unique: true,
index: true
},
title: {
type: String,
required: true,
trim: true
},
year: {
type: String,
required: true
},
rated: String,
released: String,
runtime: String,
genre: [String],
director: String,
writer: String,
actors: [String],
plot: {
type: String,
maxlength: 1000
},
language: String,
country: String,
poster: String,
ratings: [
{
source: String,
value: String
}
],
imdbRating: String,
imdbVotes: String,
type: {
type: String,
      enum: ['movie', 'series', 'episode'],
      default: 'movie'
    },
    totalSeasons: String,
    // Additional fields
    views: {
      type: Number,
      default: 0
    },
    favoritedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);
// Index for text search
movieSchema.index({ title: 'text', plot: 'text', actors: 'text' });
// Virtual for favorite count
movieSchema.virtual('favoriteCount').get(function() {
  return this.favoritedBy.length;
});
// Method to increment views
movieSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};
module.exports = mongoose.model('Movie', movieSchema);
