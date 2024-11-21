import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import About from "./component/About/About";
import FAQ from "./component/Q&A/FAQ.jsx";
import Register from "./component/Register/Register";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
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

const allowedPaths = [
  "/",
  "/FAQ",
  "/register",
  "/packages",
  "/regular-packages",
  "/CreateAlbum",
  "/all-albums",
  "/update-profile",
  "/update-profile/edit",
  "/verify-password",
  "/selfie/:albumId",
  "/your-album/:albumId",
  "/matched-images/:albumId/:userId",
  "/forgot-password",
  "/reset-password/:token",
  "/admin/users",
];

// פונקציה לבדיקה אם הנתיב מותר
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

  useEffect(() => {
    const isAllowed = isPathAllowed(location.pathname);

    // בדיקת הרשאות לחבילות רגילות
    if (
      userInformation?.role !== "user" &&
      location.pathname === "/regular-packages"
    ) {
      navigate("/packages");
      return;
    }

    // בדיקת הרשאות לכל הנתיבים שאינם ב-allowedPaths
    if (userInformation && !isAllowed) {
      if (userInformation.role === "admin") {
        navigate("/admin/users");
      } else if (userInformation.role === "business") {
        navigate("/all-albums");
      } else {
        navigate("/CreateAlbum");
      }
    } else if (!userInformation && !isAllowed) {
      navigate("/register");
    }
  }, [userInformation, navigate, location.pathname]);

  const pathsWithoutDashboard = ["/", "/FAQ", "/regular-packages"];

  // תנאי להצגת ה-Dashboard
  const shouldShowDashboard =
    userInformation?.role &&
    userInformation.role === "admin" &&
    !pathsWithoutDashboard.includes(location.pathname);

  useEffect(() => {
    if (
      userInformation?.role === "business" &&
      location.pathname === "/packages"
    ) {
      navigate("/all-albums"); // ניתוב לדף אחר אם צריך
    }
  }, [userInformation, location.pathname, navigate]);

  return (
    <div>
      {shouldShowDashboard && <Dashboard />}
      <Routes>
        {/* אדמין */}

        <Route path="/admin/users" element={<AlllUsers />} />
        {/* נתיבים כלליים */}
        <Route path="/" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/register" element={<Register />} />

        {/* נתיבי העלאת תמונות */}
        <Route path="/upload" element={<EventImageUpload />} />
        <Route path="/selfie/:albumId" element={<Selfie />} />

        {/* חבילות */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/regular-packages" element={<RegularPackages />} />

        {/* אירועים ואלבומים */}
        <Route path="/EventPhoneUpload" element={<EventPhoneUpload />} />
        <Route path="/CreateAlbum" element={<CreateAlbum />} />
        <Route path="/all-albums" element={<AllAlbums />} />
        <Route path="/your-album/:albumId" element={<YourAlbum />} />

        {/* פרופיל משתמש */}
        <Route
          path="/update-profile"
          element={<VerifyPassword redirectPath="/update-profile/edit" />}
        />
        <Route path="/update-profile/edit" element={<UpdateProfile />} />

        {/* תמונות תואמות */}
        <Route
          path="/matched-images/:albumId/:userId"
          element={<MatchedImages />}
        />

        {/* סיסמאות */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
