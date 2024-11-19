// src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuIcon from "../../images/menu-svgrepo-com.svg";
import SunIcon from "../../images/Sunny.png";
import MoonIcon from "../../images/Moon.png";
import SearchIcon from "../../images/SearchIcon.png";
import Button from "../../Library/Button.jsx";
import "./Navbar.css";
import useNavBar from "../../hooks/useNavBar/useNavbar.jsx"; // עדכון הנתיב בהתאם למיקום החדש של useNavBar
const NavBar = ({ onSearch }) => {
  const {
    isSun,
    handleIconClick,
    isExpanded,
    searchQuery,
    isMenuOpen,
    handleSearchIconClick,
    handleLogout,
    toggleMenu,
    handleSearchInputChange,
    userInformation,
  } = useNavBar(onSearch);

  return (
    <header className="header">
      <nav className={`container_nav ${isSun ? "dark" : "light"}`}>
        <div className="hamburger" onClick={toggleMenu}>
          <img
            src={MenuIcon}
            alt="Menu"
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
                    <Link className="link" to={"/all-albums"}>
                      all-albums
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/update-profile">
                      Update Profile{" "}
                    </Link>
                  </li>
                </>
              )}
              {userInformation.role === "business" && (
                <>
                  {" "}
                  <li>
                    <Link className="link" to={"/all-albums"}>
                      all-albums
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/update-profile">
                      Update Profile{" "}
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
            <li style={{ backgorund: "none" }}>
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
                alt="Theme Toggle Icon"
                onClick={handleIconClick}
                className="moon_sun_icon"
              />
            </li>
          </div>
        </ul>
      </nav>
      <ToastContainer />
    </header>
  );
};

export default NavBar;
