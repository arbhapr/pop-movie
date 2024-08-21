import { useState } from "react";

const Search = ({ movies }) => {
    const [query, setQuery] = useState("");
    return (
        <>
            <input
                className="search"
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <p className="num-results">
                Found <strong>{movies.length}</strong> results
            </p>
        </>
    );
};

export default Search;
