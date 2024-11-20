import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import useNavBar from "../hooks/useNavBar/useNavbar"; // ייבוא הפונקציות מ-useNavBar
import { UserContext } from "../hooks/UserHooks/userContextApp";
import albumsIMG from "../images/albumsIMG.svg";
import settingIMG from "../images/settingIMG.svg";
import dashboardIMG from "../images/dashboardIMG.svg";
import sandboxIMG from "../images/sandboxIMG.svg";
import packagesIMG from "../images/packagesIMG.svg";
import adminDashboardIMG from "../images/dashboardIMG.svg";
import memomentIMG from "../images/Memoment.svg";
import LoadingCamera from "../Library/LoadingCamera";
import logoutIMG from "../images/logoutIMG.svg"; // אייקון חדש ל-Logout
import stylesDashboard from "./Dashboard.module.css";
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { userInformation, loading } = useContext(UserContext);

  // שימוש ב-useNavBar לייבוא handleLogout
  const { handleLogout } = useNavBar();

  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  // אם המידע עדיין בטעינה, מציג מסך טעינה
  if (loading) {
    return <LoadingCamera />;
  }

  // אם המשתמש אינו מסוג "business" או "admin", לא מציג את ה-Dashboard
  if (
    userInformation?.role !== "business" &&
    userInformation?.role !== "admin"
  ) {
    return null;
  }

  return (
    <div
      className={`${stylesDashboard.dashboard} ${
        isOpen ? stylesDashboard.open : stylesDashboard.closed
      }`}
    >
      {/* כפתור תפריט */}
      <button
        className={`${stylesDashboard.menuButton} ${
          !isOpen ? stylesDashboard.rotate : ""
        }`}
        onClick={toggleDashboard}
      >
        <img
          src={dashboardIMG}
          alt="Toggle Dashboard"
          className={stylesDashboard.menuIcon}
        />
      </button>

      {/* תוכן התפריט */}
      {isOpen && (
        <div className={stylesDashboard.content}>
          <nav className={stylesDashboard.navLinks}>
            {/* לינקים גלובאליים */}
            <Link to="/all-albums" className={stylesDashboard.link}>
              <img
                src={albumsIMG}
                alt="Albums"
                className={stylesDashboard.icon}
              />
              <span>All Albums</span>
            </Link>
            <Link to="/update-profile" className={stylesDashboard.link}>
              <img
                src={settingIMG}
                alt="Update User"
                className={stylesDashboard.icon}
              />
              <span>Update User</span>
            </Link>

            {/* לינקים לביזנס */}
            {userInformation.role === "business" && (
              <>
                <Link to="/" className={stylesDashboard.link}>
                  <img
                    src={memomentIMG}
                    alt="MeMoment"
                    className={stylesDashboard.icon}
                  />
                  <span>MeMoment</span>
                </Link>
              </>
            )}

            {/* לינקים למנהל */}
            {userInformation.role === "admin" && (
              <>
                <Link to="/admin/users" className={stylesDashboard.link}>
                  <img
                    src={adminDashboardIMG}
                    alt="Admin Dashboard"
                    className={stylesDashboard.icon}
                  />
                  <span>Admin Dashboard</span>
                </Link>
                <Link to="/" className={stylesDashboard.link}>
                  <img
                    src={memomentIMG}
                    alt="MeMoment"
                    className={stylesDashboard.icon}
                  />
                  <span>MeMoment</span>
                </Link>
                <Link to="/bigpackages" className={stylesDashboard.link}>
                  <img
                    src={packagesIMG}
                    alt="Big Packages"
                    className={stylesDashboard.icon}
                  />
                  <span>Big Packages</span>
                </Link>
                <Link to="/packages" className={stylesDashboard.link}>
                  <img
                    src={packagesIMG}
                    alt="Packages"
                    className={stylesDashboard.icon}
                  />
                  <span>Packages</span>
                </Link>
                <Link to="/sandbox" className={stylesDashboard.link}>
                  <img
                    src={sandboxIMG}
                    alt="Sandbox"
                    className={stylesDashboard.icon}
                  />
                  <span>Sandbox</span>
                </Link>
              </>
            )}
          </nav>

          {/* כפתור Logout */}
          {userInformation && (
            <Link
              to="/register"
              className={stylesDashboard.link}
              onClick={(e) => {
                e.preventDefault(); // מונע את הפעולה הדיפולטיבית של ה-Link
                handleLogout();
              }}
            >
              <img
                src={logoutIMG}
                alt="Logout"
                className={stylesDashboard.icon}
              />
              <span>Logout</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
