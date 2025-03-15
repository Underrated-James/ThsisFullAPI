import { Link } from "react-router-dom";
import "../CssFiles/Header.css";

function Header() {
  return (
    <header className="header">
      <h2 className="logo">Logo</h2>
      <nav className="nav-menu">
        <Link to="/" className="nav-item">HOME</Link>
        <Link to="/games" className="nav-item">GAMES</Link>
        <Link to="/about" className="nav-item active">ABOUT</Link>
        <Link to="/contact" className="nav-item">CONTACT</Link>
      </nav>
    </header>
  );
}

export default Header;
