import { useEffect, useState } from "react";
import { StarRating } from "./components";

const OMDB_APIKEY = "f255d928";

const average = (arr) => arr.reduce((acc, cur) => acc + cur / arr.length, 0);

function Logo() {
    return (
        <div className="logo">
            <span role="img">🎫</span>
            <h1>Movie</h1>
        </div>
    );
}

function Search({ setQuery }) {
    const [query, setLocalQuery] = useState("");
    const handleChange = (e) => {
        setLocalQuery(e.target.value);
        setQuery(e.target.value);
    };

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={handleChange}
        />
    );
}

function NumResult({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies?.length}</strong> results
        </p>
    );
}

function NavBar({ children }) {
    return <nav className="nav-bar">{children}</nav>;
}

function MovieItem({ movie, onSelectMovieId }) {
    return (
        <li onClick={() => onSelectMovieId(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>📅</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function MovieList({ movies, onSelectMovieId }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <MovieItem
                    movie={movie}
                    key={movie.imdbID}
                    onSelectMovieId={onSelectMovieId}
                />
            ))}
        </ul>
    );
}

function WatchedItem({ movie, onDeleteWatched }) {
    return (
        <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>🎬</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <button
                    className="btn-delete"
                    onClick={() => onDeleteWatched(movie.imdbID)}
                >
                    X
                </button>
            </div>
        </li>
    );
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>🎬</span>
                    <span>{avgImdbRating.toFixed(1)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(1)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{Math.trunc(avgRuntime)} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedList({ watched, onDeleteWatched }) {
    return (
        <>
            <ul className="list">
                {watched.length > 0 ? (
                    watched.map((movie) => (
                        <WatchedItem
                            movie={movie}
                            key={movie.imdbID}
                            onDeleteWatched={onDeleteWatched}
                        />
                    ))
                ) : (
                    <ErrorMessage message={"No watched movies yet."} />
                )}
            </ul>
        </>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

function BoxMovies({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function MovieDetail({ selectedId, onCloseMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const isWatched = watched.some((movie) => movie.imdbID === selectedId);
    const userRatingWatched = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

    const {
        imdbRating,
        Title: title,
        Poster: poster,
        Runtime: runtime,
        Released: released,
        Year: year,
        Plot: plot,
        Genre: genre,
        Actors: actors,
        Director: director,
    } = movie;

    function handleAddWatched() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating: Number(userRating),
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(() => {
        async function getMovieDetail() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://www.omdbapi.com/?apikey=${OMDB_APIKEY}&i=${selectedId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch movie details.");
                }

                const data = await response.json();
                setMovie(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        getMovieDetail();
    }, [selectedId]);

    useEffect(() => {
        if (!title) return;
        document.title = `PopMovie | ${title}`;

        return function () {
            document.title = `PopMovie`;
        };
    }, [title]);

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            x
                        </button>
                        <img src={poster} alt={`${title} poster`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                <span>🗓️</span>
                                <span>{released}</span>
                            </p>
                            <p>
                                <span>⏳</span>
                                <span>{runtime}</span>
                            </p>
                            <p>
                                <span>🌟</span>
                                <span>{imdbRating}</span>
                            </p>
                        </div>
                    </header>
                    <section>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Genre: {genre}</p>
                        <p>Starring: {actors}</p>
                        <p>Directed by: {director}</p>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating
                                        max={5}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAddWatched}
                                        >
                                            Watched this movie!
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You have watched this movie already with
                                    rating {userRatingWatched} / 5.
                                </p>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

function Loader() {
    return (
        <div className="loader">
            <div className="loading-bar">
                <div className="bar"></div>
            </div>
        </div>
    );
}

function ErrorMessage({ message }) {
    return (
        <div className="error">
            <span>⛔</span> {message}
        </div>
    );
}

function App() {
    const [error, setError] = useState(null);
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [movieQuery, setMovieQuery] = useState("superman");
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    function handleSelectMovie(id) {
        setSelectedMovieId((selectedId) => (selectedId === id ? null : id));
    }

    function handleCloseMovie() {
        setSelectedMovieId(null);
    }

    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    useEffect(() => {
        const fetchMovies = async () => {
            if (!movieQuery || movieQuery.length < 3) {
                setMovies([]);
                setError("Input keyword minimum 3 chars.");
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `https://www.omdbapi.com/?apikey=${OMDB_APIKEY}&s=${movieQuery}`
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                if (data.Response === "False") {
                    setError(data.Error);
                    setMovies([]);
                } else {
                    setMovies(data.Search);
                }
            } catch (err) {
                console.error(err.message);
                setError("Failed to fetch movies. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchTimeout = setTimeout(fetchMovies, 300);
        return () => clearTimeout(fetchTimeout);
    }, [movieQuery]);

    return (
        <>
            <NavBar>
                <Logo />
                <Search setQuery={setMovieQuery} />
                <NumResult movies={movies} />
            </NavBar>
            <Main>
                <BoxMovies>
                    {isLoading && <Loader />}
                    {!isLoading && error && <ErrorMessage message={error} />}
                    {!isLoading && !error && movies.length > 0 ? (
                        <MovieList
                            movies={movies}
                            onSelectMovieId={handleSelectMovie}
                        />
                    ) : (
                        !isLoading &&
                        !error &&
                        movies.length === 0 && (
                            <ErrorMessage
                                message={
                                    "No results found. Please try a different search."
                                }
                            />
                        )
                    )}
                </BoxMovies>
                <BoxMovies>
                    {selectedMovieId ? (
                        <MovieDetail
                            selectedId={selectedMovieId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </BoxMovies>
            </Main>
        </>
    );
}

export default App;
