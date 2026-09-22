
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    🎬 Movie Discovery
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/wishlist">♡ Wishlist</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar
