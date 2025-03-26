
import "../CssFiles/Header.css";
import { NavLink } from "react-router-dom";


function Header() {
  return (
    <header className="header">
      <h2 className="logo">Logo</h2>
      <nav className="nav-menu">
        {/*<Link to="/" className="nav-item">HOME</Link>{/* Sidebar */}
        <NavLink to="/games" className="nav-item">GAMES</NavLink>
<NavLink to="/about" className="nav-item">ABOUT</NavLink>
<NavLink to="/settings" className="nav-item">SETTINGS</NavLink>

      </nav>
    </header>
  );
}

export default Header;
