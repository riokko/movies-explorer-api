const mongoose = require("mongoose");
const { isURL } = require("validator");

const movieSchema = new mongoose.Schema({
    country: { type: String, required: true }, // страна создания фильма
    director: { type: String, required: true }, // режиссёр фильма
    duration: { type: Number, required: true }, // длительность фильма
    year: { type: String, required: true }, // год выпуска фильма
    description: { type: String, required: true }, // описание фильма
    image: {
        // ссылка на постер к фильму
        type: String,
        required: true,
        validate: {
            validator: (value) => isURL(value),
            message: (props) => `${props.value} не является адресом URL`,
        },
    },
    trailer: {
        // ссылка на трейлер к фильму
        type: String,
        required: true,
        validate: {
            validator: (value) => isURL(value),
            message: (props) => `${props.value} не является адресом URL`,
        },
    },
    thumbnail: {
        // ссылка на миниатюрное изображение постера к фильму
        type: String,
        required: true,
        validate: {
            validator: (value) => isURL(value),
            message: (props) => `${props.value} не является адресом URL`,
        },
    },
    owner: {
        // _id пользователя, который сохранил фильм
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    movieId: { type: Number, required: true }, // _id фильма, который содержится в ответе сервиса MoviesExplorer.
    nameRU: { type: String, required: true }, // название фильма на русском языке
    nameEN: { type: String, required: true }, // название фильма на английском языке
});

module.exports = mongoose.model("movie", movieSchema);
