import Logo from "./Logo";
import Search from "./Search";

const Navbar = ({ movies }) => {
    return (
        <nav className="nav-bar">
            <Logo />
            <Search movies={movies} />
        </nav>
    );
};

export default Navbar;
