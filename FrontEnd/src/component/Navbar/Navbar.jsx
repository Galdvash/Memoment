import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../hooks/DarkMode/DarkModeContext";
import { UserContext } from "../../hooks/UserHooks/userContextApp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuIcon from "@mui/icons-material/Menu";
import SunIcon from "../../images/Sunny.png";
import MoonIcon from "../../images/Moon.png";
import SearchIcon from "../../images/SearchIcon.png";
import Jobs from "../../images/Jobs.png";
import Button from "../../Library/Button.jsx";

import "../Navbar/Navbar.css";

const NavBar = ({ onSearch }) => {
  const { isSun, handleIconClick } = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu open/close
  const { userInformation, setUserInformation } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSearchIconClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    // Confirm logout with the user
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setUserInformation(null);
      localStorage.removeItem("userInformation");
      localStorage.removeItem("token");
      navigate("/");
      toast.success("Logged out successfully"); // Set toast message
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query); // Call the search function passed as a prop
  };

  return (
    <header className="header">
      <nav className={`container_nav ${isSun ? "dark" : "light"}`}>
        <img className="logo" src={Jobs} alt="jobs" />

        <div className="hamburger" onClick={toggleMenu}>
          <MenuIcon
            className="menuIcon"
            style={{ width: "33px", height: "35px" }}
          />
        </div>

        <ul className={`link_list ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link className="link" to={"/"}>
              <b>Memonet</b>
            </Link>
          </li>
          <li>
            <Link className="link" to={"/"}>
              Home
            </Link>
          </li>
          <li>
            <Link className="link" to={"/"}>
              Packages
            </Link>
          </li>
          <li>
            <Link className="link" to={"/selfie"}>
              Selfie
            </Link>
          </li>
          <li>
            <Link className="link" to={"/upload"}>
              Image
            </Link>
          </li>
          <li style={{ border: "1px solid grey" }}>
            <Link className="link" to={"/"}>
              Contact Us
            </Link>
          </li>

          {userInformation?.isAdmin && (
            <>
              <li>
                <Link className="link" to={"/myCards"}>
                  My Cards
                </Link>
              </li>
              <li>
                <Link className="link" to={"/sandBox"}>
                  SandBox
                </Link>
              </li>
            </>
          )}
          {userInformation?.isBusiness && (
            <>
              <li>
                <Link className="link" to={"/myCards"}>
                  My Cards
                </Link>
              </li>
            </>
          )}

          {!userInformation?.isAdmin &&
            !userInformation?.isBusiness &&
            userInformation && (
              <li>
                <Link className="link" to={"/myCards"}>
                  My Cards
                </Link>
              </li>
            )}

          <li>
            {userInformation ? (
              <button className="link" onClick={handleLogout}>
                Logout
              </button>
            ) : null}
          </li>

          <div className="moveRight">
            {!userInformation &&
              !userInformation?.isAdmin &&
              !userInformation?.isBusiness && (
                <Link className="link" to={"/register"}>
                  <Button />
                </Link>
              )}
            <li>
              <div className="searchBar">
                <input
                  className={
                    isExpanded ? "expanded searchInput" : "searchInput"
                  }
                  type="text"
                  placeholder="Search Your Card..."
                  value={searchQuery}
                  onChange={handleSearchInputChange} // Handle search input change
                />
                <img
                  src={SearchIcon}
                  alt="Search Icon"
                  onClick={handleSearchIconClick}
                  className={
                    isExpanded ? "searchIcon searchIconMoved" : "searchIcon"
                  }
                />
              </div>
            </li>
            <li>
              <img
                src={isSun ? SunIcon : MoonIcon}
                alt="Sun Icon"
                onClick={handleIconClick}
                className="moon_sun_icon"
              />
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
