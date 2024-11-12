import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../hooks/DarkMode/DarkModeContext";
import { UserContext } from "../../hooks/UserHooks/userContextApp";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuIcon from "../../images/menu-svgrepo-com.svg";
import SunIcon from "../../images/Sunny.png";
import MoonIcon from "../../images/Moon.png";
import SearchIcon from "../../images/SearchIcon.png";
import Button from "../../Library/Button.jsx";
import "./Navbar.css";

const NavBar = ({ onSearch }) => {
  const { isSun, handleIconClick } = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInformation, setUserInformation } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSearchIconClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        await axios.post(
          "http://localhost:5000/api/users/logout",
          {},
          { withCredentials: true }
        );
        localStorage.removeItem("token"); // מחיקת הטוקן מה-localStorage
        setUserInformation(null); // איפוס מידע המשתמש
        navigate("/"); // הפניה לעמוד הראשי
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed!");
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="header">
      <nav className={`container_nav ${isSun ? "dark" : "light"}`}>
        <div className="hamburger" onClick={toggleMenu}>
          <img
            src={MenuIcon}
            alt=""
            className="menuIcon"
            style={{ width: "33px", height: "35px" }}
          />
        </div>

        <ul className={`link_list ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link className="link" to={"/"}>
              <b style={{ fontFamily: "Inter, sans-serif" }}>MeMoment</b>
            </Link>
          </li>
          <li>
            <Link className="link" to={"/FAQ"}>
              Q&A
            </Link>
          </li>
          <li>
            <Link className="link" to={"/"}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link className="link" to={"/selfie"}>
              selfie
            </Link>
          </li>

          {/* הצגת Register למי שלא מחובר בלבד */}
          {!userInformation && (
            <li>
              <Link className="link" to={"/register"}>
                Register
              </Link>
            </li>
          )}

          {/* Links for different user roles */}
          {userInformation && (
            <>
              {userInformation.role === "user" && (
                <>
                  <li>
                    <Link className="link" to={"/packages"}>
                      Packages
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to={"/upload"}>
                      upload
                    </Link>
                  </li>
                </>
              )}
              {userInformation.role === "business" && (
                <>
                  <li>
                    <Link className="link" to={"/bigpackages"}>
                      BigPackages
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to={"/upload"}>
                      upload
                    </Link>
                  </li>
                </>
              )}
              {userInformation.role === "admin" && (
                <>
                  <li>
                    <Link className="link" to={"/bigpackages"}>
                      BigPackages
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to={"/packages"}>
                      Packages
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to={"/sandbox"}>
                      Sandbox
                    </Link>
                  </li>
                </>
              )}
            </>
          )}

          {/* כפתור Logout רק למשתמשים מחוברים */}
          {userInformation && (
            <li>
              <button className="link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}

          <div className="moveRight">
            {!userInformation && (
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
                  onChange={handleSearchInputChange}
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
