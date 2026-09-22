const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Wishlist = require("./models/Wishlist");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// TMDB axios instance
const tmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 15000
});

// Small retry helper for temporary TMDB/network failures
async function tmdbRequest(config, retries = 2) {
    try {
        return await tmdb.get(config.url, {
            params: {
                ...config.params,
                api_key: process.env.TMDB_API_KEY
            }
        });
    } catch (error) {
        const retryable =
            error.code === "ECONNRESET" ||
            error.code === "ETIMEDOUT" ||
            error.code === "ECONNABORTED" ||
            error.code === "EAI_AGAIN";

        if (retryable && retries > 0) {
            console.log(
                `TMDB request failed (${error.code}). Retrying...`
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));

            return tmdbRequest(config, retries - 1);
        }

        throw error;
    }
}

// Get movies
app.get("/api/movies", async (req, res) => {
    try {
        const {
            search,
            page = 1,
            genre,
            sort = "popularity.desc"
        } = req.query;

        const endpoint = search
            ? "/search/movie"
            : "/discover/movie";

        const params = {
            page: Number(page)
        };

        if (search) {
            params.query = search;
        } else {
            params.sort_by = sort;

            if (genre) {
                params.with_genres = genre;
            }
        }

        const response = await tmdbRequest({
            url: endpoint,
            params
        });

        const movies = (response.data.results || []).map((movie) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            rating: movie.vote_average
        }));

        res.json({
            page: response.data.page,
            totalPages: response.data.total_pages,
            movies
        });

    } catch (error) {
        console.error(
            "TMDB error:",
            error.code || error.message
        );

        res.status(500).json({
            message: "Failed to fetch movies"
        });
    }
});

// Get movie genres
app.get("/api/genres", async (req, res) => {
    try {
        const response = await tmdbRequest({
            url: "/genre/movie/list",
            params: {}
        });

        res.json(response.data.genres || []);

    } catch (error) {
        console.error(
            "Genres error:",
            error.code || error.message
        );

        res.status(500).json({
            message: "Failed to fetch genres"
        });
    }
});

// Get movie details
app.get("/api/movies/:id", async (req, res) => {
    try {
        const response = await tmdbRequest({
            url: `/movie/${req.params.id}`,
            params: {}
        });

        const movie = response.data;

        res.json({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
            releaseDate: movie.release_date,
            rating: movie.vote_average,
            runtime: movie.runtime,
            genres: movie.genres?.map((genre) => genre.name) || []
        });

    } catch (error) {
        console.error(
            "Movie details error:",
            error.code || error.message
        );

        res.status(500).json({
            message: "Failed to fetch movie details"
        });
    }
});

// Get wishlist
app.get("/api/wishlist", async (req, res) => {
    try {
        const wishlist = await Wishlist
            .find()
            .sort({ createdAt: -1 });

        res.json(wishlist);

    } catch (error) {
        console.error(
            "Wishlist error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch wishlist"
        });
    }
});

// Add movie to wishlist
app.post("/api/wishlist", async (req, res) => {
    try {
        const {
            movieId,
            title,
            posterPath,
            releaseDate,
            rating
        } = req.body;

        const movie = await Wishlist.create({
            movieId,
            title,
            posterPath,
            releaseDate,
            rating
        });

        res.status(201).json(movie);

    } catch (error) {
        console.error(
            "Add wishlist error:",
            error.message
        );

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Movie already exists in wishlist"
            });
        }

        res.status(500).json({
            message: "Failed to add movie"
        });
    }
});

// Remove movie from wishlist
app.delete("/api/wishlist/:movieId", async (req, res) => {
    try {
        const movie = await Wishlist.findOneAndDelete({
            movieId: Number(req.params.movieId)
        });

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found in wishlist"
            });
        }

        res.json({
            message: "Movie removed from wishlist"
        });

    } catch (error) {
        console.error(
            "Delete wishlist error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to remove movie"
        });
    }
});

// Connect MongoDB and start server
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error.message
        );
    });