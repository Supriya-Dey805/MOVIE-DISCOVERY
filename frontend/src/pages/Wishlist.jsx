import { useEffect, useState } from "react";

function Wishlist() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [movieToRemove, setMovieToRemove] = useState(null);

    const fetchWishlist = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/wishlist"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch wishlist");
            }

            const data = await response.json();

            setMovies(data);
        } catch (error) {
            setError("Unable to load wishlist.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const showToast = (message) => {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    };

    const removeFromWishlist = async (movieId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/wishlist/${movieId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove movie");
            }

            setMovies((currentMovies) =>
                currentMovies.filter(
                    (movie) => movie.movieId !== movieId
                )
            );

            setMovieToRemove(null);

            showToast("Movie removed from wishlist.");
        } catch (error) {
            setMovieToRemove(null);

            showToast(
                "Could not remove movie from wishlist."
            );
        }
    };

    return (
        <main>
            <h1>My Wishlist</h1>

            {loading && (
                <p>Loading wishlist...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {!loading &&
                !error &&
                movies.length === 0 && (
                    <p>Your wishlist is empty.</p>
                )}

            {!loading &&
                !error &&
                movies.length > 0 && (
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <div
                                className="movie-card"
                                key={movie.movieId}
                            >
                                {movie.posterPath ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                                        alt={movie.title}
                                    />
                                ) : (
                                    <div className="no-poster">
                                        No Image
                                    </div>
                                )}

                                <div className="movie-info">
                                    <h3>{movie.title}</h3>

                                    <p>
                                        ⭐{" "}
                                        {movie.rating?.toFixed(1)}
                                    </p>

                                    <p>
                                        {movie.releaseDate ||
                                            "Release date unavailable"}
                                    </p>

                                    <button
                                        onClick={() =>
                                            setMovieToRemove(movie)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {toast && (
                <div className="toast">
                    ✓ {toast}
                </div>
            )}

            {movieToRemove && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h2>Remove from Wishlist?</h2>

                        <p>
                            Are you sure you want to remove{" "}
                            <strong>
                                {movieToRemove.title}
                            </strong>{" "}
                            from your wishlist?
                        </p>

                        <div className="modal-actions">
                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setMovieToRemove(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-remove-button"
                                onClick={() =>
                                    removeFromWishlist(
                                        movieToRemove.movieId
                                    )
                                }
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Wishlist;