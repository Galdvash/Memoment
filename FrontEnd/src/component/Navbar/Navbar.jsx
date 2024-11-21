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
import styleNavbar from "./styleNavbar.module.css";

import useNavBar from "../../hooks/useNavBar/useNavbar.jsx"; // עדכון הנתיב בהתאם למיקום החדש של useNavBar
const NavBar = ({ onSearch }) => {
  const {
    isSun,
    handleIconClick,
    isExpanded,
    searchQuery,
    isMenuOpen,
    setIsMenuOpen,
    handleSearchIconClick,
    handleLogout,
    toggleMenu,
    handleSearchInputChange,
    userInformation,
  } = useNavBar(onSearch);
  const handleLinkClick = (e) => {
    if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
      setIsMenuOpen(false); // סגור את ה-Navbar
    }
  };
  return (
    <header className={styleNavbar.header}>
      <nav
        className={`${styleNavbar.container_nav} ${
          isSun ? styleNavbar.dark : styleNavbar.light
        }`}
      >
        <div className={styleNavbar.hamburger} onClick={toggleMenu}>
          <img
            src={MenuIcon}
            alt="Menu"
            className={styleNavbar.menuIcon}
            style={{ width: "33px", height: "35px" }}
          />
        </div>

        <ul
          onClick={(e) => handleLinkClick(e)}
          className={`${styleNavbar.link_list} ${
            isMenuOpen ? styleNavbar.open : ""
          }`}
        >
          <li>
            <Link className={styleNavbar.link} to={"/"}>
              <b style={{ fontFamily: "Inter, sans-serif" }}>MeMoment</b>
            </Link>
          </li>
          <li>
            <Link className={styleNavbar.link} to={"/FAQ"}>
              Q&A
            </Link>
          </li>
          <li>
            <Link className={styleNavbar.link} to={"/"}>
              Contact Us
            </Link>
          </li>

          {!userInformation && (
            <li>
              <Link className={styleNavbar.link} to={"/register"}>
                Register
              </Link>
            </li>
          )}

          {userInformation && (
            <>
              {userInformation.role === "user" && (
                <>
                  <li>
                    <Link className={styleNavbar.link} to={"/all-albums"}>
                      all-albums
                    </Link>
                  </li>
                  <li>
                    <Link className={styleNavbar.link} to="/update-profile">
                      Update Profile
                    </Link>
                  </li>
                </>
              )}
              {userInformation.role === "business" && <></>}
              {userInformation.role === "admin" && (
                <>
                  <li>
                    <Link className={styleNavbar.link} to={"/bigpackages"}>
                      BigPackages
                    </Link>
                  </li>
                  <li>
                    <Link className={styleNavbar.link} to={"/packages"}>
                      Packages
                    </Link>
                  </li>
                  <li>
                    <Link className={styleNavbar.link} to={"/sandbox"}>
                      Sandbox
                    </Link>
                  </li>
                </>
              )}
            </>
          )}

          <div
            className={`${styleNavbar.moveRight} ${
              isMenuOpen ? styleNavbar.open : ""
            }`}
          >
            {userInformation && (
              <li>
                <button
                  className={styleNavbar.btnLogOut}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
            {!userInformation && (
              <Link className={styleNavbar.link} to={"/register"}>
                <Button />
              </Link>
            )}
            <li>
              <div className={styleNavbar.searchBar}>
                <input
                  className={
                    isExpanded
                      ? `${styleNavbar.expanded} ${styleNavbar.searchInput}`
                      : styleNavbar.searchInput
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
                    isExpanded
                      ? `${styleNavbar.searchIcon} ${styleNavbar.searchIconMoved}`
                      : styleNavbar.searchIcon
                  }
                />
              </div>
            </li>
            <li>
              <img
                src={isSun ? SunIcon : MoonIcon}
                alt="Theme Toggle Icon"
                onClick={handleIconClick}
                className={styleNavbar.moon_sun_icon}
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
