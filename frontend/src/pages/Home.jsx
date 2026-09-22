import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

function Home() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [genre, setGenre] = useState("");
    const [sort, setSort] = useState("popularity.desc");

    const fetchMovies = async () => {
        setLoading(true);
        setError("");

        try {
            let url =
                `http://localhost:5000/api/movies?page=${page}` +
                `&sort=${encodeURIComponent(sort)}`;

            if (search.trim()) {
                url += `&search=${encodeURIComponent(search.trim())}`;
            }

            if (genre) {
                url += `&genre=${genre}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }

            const data = await response.json();

            setMovies(data.movies);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError("Unable to load movies.");
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/genres"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch genres");
            }

            const data = await response.json();

            setGenres(data);
        } catch (error) {
            console.error("Failed to load genres");
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [page, genre, sort]);

    const handleSearch = (event) => {
        event.preventDefault();

        setPage(1);
        fetchMovies();
    };

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
        setPage(1);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
        setPage(1);
    };

    const showToast = (message) => {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    };

    const addToWishlist = async (movie) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/wishlist",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        movieId: movie.id,
                        title: movie.title,
                        posterPath: movie.posterPath,
                        releaseDate: movie.releaseDate,
                        rating: movie.rating
                    })
                }
            );

            if (response.status === 409) {
                showToast("Movie is already in your wishlist.");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to add movie");
            }

            showToast("Added to wishlist!");
        } catch (error) {
            showToast("Could not add movie to wishlist.");
        }
    };

    return (
        <main className="home-page">
            <h1>Discover Movies</h1>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <button type="submit">
                    Search
                </button>
            </form>

            <div className="filters">
                <select
                    value={genre}
                    onChange={handleGenreChange}
                >
                    <option value="">
                        All Genres
                    </option>

                    {genres.map((item) => (
                        <option
                            key={item.id}
                            value={item.id}
                        >
                            {item.name}
                        </option>
                    ))}
                </select>

                <select
                    value={sort}
                    onChange={handleSortChange}
                >
                    <option value="popularity.desc">
                        Most Popular
                    </option>

                    <option value="vote_average.desc">
                        Highest Rated
                    </option>

                    <option value="release_date.desc">
                        Newest
                    </option>

                    <option value="release_date.asc">
                        Oldest
                    </option>
                </select>
            </div>

            {loading && (
                <p>
                    Loading movies...
                </p>
            )}

            {error && (
                <p>
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                movies.length === 0 && (
                    <p>
                        No movies found.
                    </p>
                )}

            {!loading &&
                !error &&
                movies.length > 0 && (
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onWishlist={addToWishlist}
                            />
                        ))}
                    </div>
                )}

            {!loading &&
                !error &&
                movies.length > 0 && (
                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() =>
                                setPage(page - 1)
                            }
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() =>
                                setPage(page + 1)
                            }
                        >
                            Next
                        </button>
                    </div>
                )}

            {toast && (
                <div className="toast">
                    ✓ {toast}
                </div>
            )}
        </main>
    );
}

export default Home;