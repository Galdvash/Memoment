import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import About from "./component/About/About";
import FAQ from "./component/Q&A/FAQ.jsx";
import Register from "./component/Register/Register";
import Selfie from "./component/Selfie/Selfie.jsx";
import MatchedImages from "./component/Selfie/MatchedImages.jsx";
import Packages from "./component/Packages/Packages.jsx";
import RegularPackages from "./component/Packages/RegularPackages/RegularPackages.jsx";
import EventPhoneUpload from "./component/EventPhoneUpload/EventPhoneUpload.jsx";
import CreateAlbum from "./component/AllTheEvents/CreateAlbum/CreateAlbum.jsx";
import YourAlbum from "./component/AllTheEvents/Allbums/YourAlbum.jsx";
import AllAlbums from "./component/AllTheEvents/Allbums/AllAlbums.jsx";
import UpdateProfile from "./Library/UpdateProfile.jsx";
import VerifyPassword from "./Library/VerifyPassword.jsx";
import ForgotPassword from "./component/ForgotPassword.jsx";
import ResetPassword from "./component/ResetPassword/ResetPassword.jsx";
import Dashboard from "./Library/Dashboard";
import { UserContext } from "./hooks/UserHooks/userContextApp";
import AlllUsers from "./component/Admin/AllUsers.jsx";
import ContactUs from "./component/ContactUs/ContactUs.jsx";
import SharedAlbums from "./component/AllTheEvents/Allbums/SharedAlbums.jsx";
import AlbumView from "./component/AllTheEvents/Allbums/AlbumView.jsx";

const allowedPaths = [
  "/",
  "/FAQ",
  "/register",
  "/packages",
  "/regular-packages",
  "/CreateAlbum",
  "/all-albums",
  "/contactUs",
  "/update-profile",
  "/update-profile/edit",
  "/verify-password",
  "/selfie/:albumId",
  "/your-album/:albumId",
  "/matched-images/:albumId/:userId",
  "/forgot-password",
  "/reset-password/:token",
  "/admin/users",
  "/SharedAlbums",
  "/album/:albumId",
];

// Function to check if the path is allowed
const isPathAllowed = (path) => {
  return allowedPaths.some((allowedPath) => {
    const regex = new RegExp(
      `^${allowedPath.replace(/:[^\s/]+/g, "([^/]+)")}$`
    );
    return regex.test(path);
  });
};

const AppRoutes = ({ searchQuery }) => {
  const { userInformation } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Save last visited path in localStorage
  useEffect(() => {
    if (isPathAllowed(location.pathname)) {
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    const lastPath = localStorage.getItem("lastPath");
    const isAllowed = isPathAllowed(location.pathname);

    if (!userInformation && !isAllowed) {
      navigate("/register");
    } else if (
      userInformation &&
      lastPath &&
      lastPath !== "/register" &&
      lastPath !== location.pathname &&
      isPathAllowed(lastPath)
    ) {
      navigate(lastPath); // Redirect to the last visited allowed path
    }
  }, [userInformation, navigate, location.pathname]);

  const pathsWithoutDashboard = ["/", "/register"];

  // Condition to show Dashboard
  const shouldShowDashboard =
    userInformation?.role &&
    (userInformation.role === "admin" || userInformation.role === "business") &&
    !pathsWithoutDashboard.includes(location.pathname);

  return (
    <div>
      {shouldShowDashboard && <Dashboard />}
      <Routes>
        {/* נתיבים לכלל המשתמשים */}
        <Route path="/" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contactUs" element={<ContactUs />} />

        {/* נתיבי אדמין */}
        <Route path="/admin/users" element={<AlllUsers />} />

        {/* נתיבים עסקיים */}
        <Route path="/all-albums" element={<AllAlbums />} />
        <Route path="/CreateAlbum" element={<CreateAlbum />} />

        {/* נתיבים נוספים */}
        <Route path="/SharedAlbums" element={<SharedAlbums />} />
        <Route path="/album/:albumId" element={<AlbumView />} />

        <Route path="/packages" element={<Packages />} />
        <Route path="/regular-packages" element={<RegularPackages />} />
        <Route path="/EventPhoneUpload" element={<EventPhoneUpload />} />
        <Route
          path="/update-profile"
          element={<VerifyPassword redirectPath="/update-profile/edit" />}
        />
        <Route path="/update-profile/edit" element={<UpdateProfile />} />
        <Route path="/selfie/:albumId" element={<Selfie />} />
        <Route path="/your-album/:albumId" element={<YourAlbum />} />
        <Route
          path="/matched-images/:albumId/:userId"
          element={<MatchedImages />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
