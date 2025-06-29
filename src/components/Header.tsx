
import "../CssFiles/Header.css";
import { NavLink } from "react-router-dom";
import logo from "../Images/logo1.png"; // Adjust the path as necessary


function Header() {
  return (
    <header className="header">
      <h2 className="logo">
        <img src={logo} alt="Logo" className="logo-image" width={120} height={120} />

      </h2>
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
