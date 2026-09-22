const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        movieId: {
            type: Number,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        posterPath: {
            type: String
        },
        releaseDate: {
            type: String
        },
        rating: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);