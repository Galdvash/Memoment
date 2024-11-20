import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../hooks/UserHooks/userContextApp";
import albumsIMG from "../images/albumsIMG.svg";
import settingIMG from "../images/settingIMG.svg";
import dashboardIMG from "../images/dashboardIMG.svg";
import LoadingCamera from "./LoadingCamera";
import stylesDashboard from "./Dashboard.module.css";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { userInformation, loading } = useContext(UserContext);

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
            <Link to="/all-albums" className={stylesDashboard.link}>
              <img
                src={albumsIMG}
                alt="Albums"
                className={stylesDashboard.icon}
              />
              <span>All Albums</span>
            </Link>
          </nav>
          <div className={stylesDashboard.bottomLink}>
            <Link to="/update-profile" className={stylesDashboard.link}>
              <img
                src={settingIMG}
                alt="Settings"
                className={stylesDashboard.icon}
              />
              <span>Update User</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
