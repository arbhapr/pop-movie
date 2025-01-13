import { useEffect, useState } from "react";
// import tempMovieData from "./json/movies.json";
import tempWatchedData from "./json/watchedData.json";
import { StarRating } from "./components";

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

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

function MovieItem({ movie }) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>📅</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
            <StarRating max={5} size={20} />
        </li>
    );
}

function MovieList({ movies }) {
    return (
        <ul className="list">
            {movies?.map((movie) => (
                <MovieItem movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    );
}

function WatchedItem({ movie }) {
    return (
        <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
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
    );
}

function WatchedList({ watched }) {
    return (
        <>
            <ul className="list">
                {watched.map((movie) => (
                    <WatchedItem movie={movie} key={movie.imdbID} />
                ))}
            </ul>
        </>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

function BoxMovies({ element }) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && element}
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

const OMDB_APIKEY = "f255d928";
const movieQuery = "123123"
function App() {
    const [movies, setMovies] = useState([]);
    const [watched] = useState(tempWatchedData);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchMovie() {
            try {
                setIsLoading(true);

                const res = await fetch(
                    `https://www.omdbapi.com/?apikey=${OMDB_APIKEY}&s=${movieQuery}`
                );

                const data = await res.json();
                
            if (data.Response === "False") throw new Error(data.Error);
                
                setMovies(data.Search);
                setIsLoading(false);
            } catch (err) {
                console.log(err.message);
            }
        }

        fetchMovie();
    }, []);

    return (
        <>
            <NavBar>
                <Logo />
                <Search />
                <NumResult movies={movies} />
            </NavBar>
            <Main>
                <BoxMovies
                    element={
                        isLoading ? <Loader /> : <MovieList movies={movies} />
                    }
                />
                <BoxMovies
                    element={
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedList watched={watched} />
                        </>
                    }
                />
            </Main>
        </>
    );
}

export default App;
