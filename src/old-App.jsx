import { useState } from "react";
import initialMovies from "./json/movies.json";
import initialWatchedData from "./json/watchedData.json";

function App() {
    const average = (arr) =>
        arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

    const [movies] = useState(initialMovies);
    const [watched] = useState(initialWatchedData);
    // const [isOpen1, setIsOpen1] = useState(true);
    // const [isOpen2, setIsOpen2] = useState(true);

    const avgRuntime = average(watched.map((movie) => movie.runtime));
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));

    function Logo() {
        return (
            <div className="logo">
                <span role="img">🎫</span>
                <h1>Movie</h1>
            </div>
        );
    }

    function Search() {
        const [query, setQuery] = useState("");
        return (
            <input
                className="search"
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        );
    }

    function ResultNum() {
        return (
            <p className="num-results">
                Found <strong>{movies.length}</strong> results
            </p>
        );
    }

    function Navbar() {
        return (
            <nav className="nav-bar">
                <Logo />
                <Search movies={movies} />
                <ResultNum />
            </nav>
        );
    }

    function BtnToggle() {
        const [isOpen, setIsOpen] = useState(true);
        return (
            <>
                <button
                    className="btn-toggle"
                    onClick={() => setIsOpen((open) => !open)}
                >
                    {isOpen ? "–" : "+"}
                </button>
				{isOpen && <MovieList />}
            </>
        );
    }

    function MovieList() {
        return (
            <ul className="list">
                {movies?.map((movie) => (
                    <li key={movie.imdbID}>
                        <img src={movie.Poster} alt={`${movie.Title} poster`} />
                        <h3>{movie.Title}</h3>
                        <div>
                            <p>
                                <span>📅</span>
                                <span>{movie.Year}</span>
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <>
            <Navbar movies={movies} />

            <main className="main">
                <div className="box">
					<BtnToggle />
                </div>

                <div className="box">
                    <BtnToggle />
                    {isOpen2 && (
                        <>
                            <div className="summary">
                                <h2>Movies you watched</h2>
                                <div>
                                    <p>
                                        <span>#️⃣</span>
                                        <span>{watched.length} movies</span>
                                    </p>
                                    <p>
                                        <span>🎬</span>
                                        <span>{avgImdbRating}</span>
                                    </p>
                                    <p>
                                        <span>🌟</span>
                                        <span>{avgUserRating}</span>
                                    </p>
                                    <p>
                                        <span>⏳</span>
                                        <span>{avgRuntime} min</span>
                                    </p>
                                </div>
                            </div>

                            <ul className="list">
                                {watched.map((movie) => (
                                    <li key={movie.imdbID}>
                                        <img
                                            src={movie.Poster}
                                            alt={`${movie.Title} poster`}
                                        />
                                        <h3>{movie.Title}</h3>
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
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}

export default App;
