import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useNavBar from "../hooks/useNavBar/useNavbar";
import { UserContext } from "../hooks/UserHooks/userContextApp";
import albumsIMG from "../images/albumsIMG.svg";
import settingIMG from "../images/settingIMG.svg";
import dashboardIMG from "../images/dashboardIMG.svg";
import sandboxIMG from "../images/sandboxIMG.svg";
import packagesIMG from "../images/packagesIMG.svg";
import adminDashboardIMG from "../images/dashboardIMG.svg";
import memomentIMG from "../images/Memoment.svg";
import LoadingCamera from "../Library/LoadingCamera";
import logoutIMG from "../images/logoutIMG.svg";
import stylesDashboard from "./Dashboard.module.css";

export const handleGlobalNavigation = (navigate, setIsOpen, targetPath) => {
  setIsOpen(false); // Close the dashboard
  navigate(targetPath); // Navigate to the target path
};

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { userInformation, loading } = useContext(UserContext);
  const { handleLogout } = useNavBar();

  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return <LoadingCamera />;
  }

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

      {isOpen && (
        <div className={stylesDashboard.content}>
          <nav className={stylesDashboard.navLinks}>
            <Link
              to="/all-albums"
              className={stylesDashboard.link}
              onClick={(e) => {
                e.preventDefault();
                handleGlobalNavigation(navigate, setIsOpen, "/all-albums");
              }}
            >
              <img
                src={albumsIMG}
                alt="Albums"
                className={stylesDashboard.icon}
              />
              <span>All Albums</span>
            </Link>
            <Link
              to="/update-profile"
              className={stylesDashboard.link}
              onClick={(e) => {
                e.preventDefault();
                handleGlobalNavigation(navigate, setIsOpen, "/update-profile");
              }}
            >
              <img
                src={settingIMG}
                alt="Update User"
                className={stylesDashboard.icon}
              />
              <span>Update User</span>
            </Link>

            {userInformation.role === "business" && (
              <Link
                to="/"
                className={stylesDashboard.link}
                onClick={(e) => {
                  e.preventDefault();
                  handleGlobalNavigation(navigate, setIsOpen, "/");
                }}
              >
                <img
                  src={memomentIMG}
                  alt="MeMoment"
                  className={stylesDashboard.icon}
                />
                <span>MeMoment</span>
              </Link>
            )}

            {userInformation.role === "admin" && (
              <>
                <Link
                  to="/admin/users"
                  className={stylesDashboard.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleGlobalNavigation(navigate, setIsOpen, "/admin/users");
                  }}
                >
                  <img
                    src={adminDashboardIMG}
                    alt="Admin Dashboard"
                    className={stylesDashboard.icon}
                  />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  to="/packages"
                  className={stylesDashboard.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleGlobalNavigation(navigate, setIsOpen, "/packages");
                  }}
                >
                  <img
                    src={packagesIMG}
                    alt="Big Packages"
                    className={stylesDashboard.icon}
                  />
                  <span>Big Packages</span>
                </Link>

                <Link
                  to="/sandbox"
                  className={stylesDashboard.link}
                  onClick={(e) => {
                    e.preventDefault();
                    const path = e.currentTarget.getAttribute("href");
                    handleGlobalNavigation(navigate, setIsOpen, path);
                  }}
                >
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

          {userInformation && (
            <Link
              to="/register"
              className={stylesDashboard.link}
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
                handleGlobalNavigation(navigate, setIsOpen, "/register");
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
