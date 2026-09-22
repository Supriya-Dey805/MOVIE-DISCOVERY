import { Link } from "react-router-dom";

function MovieCard({ movie, onWishlist }) {
    return (
        <div className="movie-card">
            {movie.posterPath ? (
                <img
                    src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                    alt={movie.title}
                />
            ) : (
                <div className="no-poster">No Image</div>
            )}

            <div className="movie-info">
                <Link to={`/movie/${movie.id}`}>
                    <h3>{movie.title}</h3>
                </Link>

                <p>⭐ {movie.rating?.toFixed(1)}</p>

                <p>
                    {movie.releaseDate || "Release date unavailable"}
                </p>

                <button
                    onClick={() => onWishlist(movie)}
                >
                    Add to Wishlist
                </button>
            </div>
        </div>
    );
}

export default MovieCard;