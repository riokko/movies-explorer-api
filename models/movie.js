const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    country: {},
    director: {},
    duration: {},
    year: {},
    description: {},
    image: {},
    trailer: {},
    thumbnail: {},
    owner: {},
    movieId: {},
    nameRU: {},
    nameEN: {},
});

module.exports = mongoose.model("movie", movieSchema);
