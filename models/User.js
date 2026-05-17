const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
{
username: {
type: String,
required: true,
unique: true,
trim: true,
minlength: 3
},
email: {
type: String,
required: true,
unique: true,
lowercase: true,
match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
},
favorites: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'Movie'
}],
watchlist: [{
movieId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Movie'
},
addedAt: {
type: Date,
default: Date.now
},
watched: {
type: Boolean,
default: false
}
}]
},
{
timestamps: true
}
);
// Method to add to favorites
userSchema.methods.addToFavorites = async function(movieId) {
  if (!this.favorites.includes(movieId)) {
    this.favorites.push(movieId);
    await this.save();
  }
  return this;
};
// Method to remove from favorites
userSchema.methods.removeFromFavorites = async function(movieId) {
  this.favorites = this.favorites.filter(
    id => id.toString() !== movieId.toString()
  );
  await this.save();
  return this;
};
module.exports = mongoose.model('User', userSchema);