import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function MovieDetails() {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/movies/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch movie");
                }

                const data = await response.json();
                setMovie(data);
            } catch (error) {
                setError("Unable to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) {
        return <main><p>Loading movie details...</p></main>;
    }

    if (error) {
        return <main><p>{error}</p></main>;
    }

    if (!movie) {
        return <main><p>Movie not found.</p></main>;
    }

    return (
        <main className="movie-details">
            <Link to="/">← Back to Movies</Link>

            <div className="details-container">
                {movie.posterPath && (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                        alt={movie.title}
                    />
                )}

                <div className="details-info">
                    <h1>{movie.title}</h1>

                    <p>⭐ {movie.rating?.toFixed(1)}</p>

                    <p>
                        <strong>Release Date:</strong>{" "}
                        {movie.releaseDate || "Unavailable"}
                    </p>

                    <p>
                        <strong>Runtime:</strong>{" "}
                        {movie.runtime
                            ? `${movie.runtime} minutes`
                            : "Unavailable"}
                    </p>

                    <p>
                        <strong>Genres:</strong>{" "}
                        {movie.genres?.join(", ") || "Unavailable"}
                    </p>

                    <h2>Overview</h2>
                    <p>{movie.overview || "No overview available."}</p>
                </div>
            </div>
        </main>
    );
}

export default MovieDetails;