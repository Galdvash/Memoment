// src/AppRoutes.jsx
import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import About from "./component/About/About";
import FAQ from "./component/Q&A/FAQ.jsx";
import Register from "./component/Register/Register";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
import Selfie from "./component/Selfie/Selfie.jsx";
import MatchedImages from "./component/Selfie/MatchedImages.jsx";
import Packages from "./component/Packages/Packages.jsx";
import RegularPackages from "./component/Packages/RegularPackages/RegularPackages.jsx"; // ייבוא קומפוננטת RegularPackages
import EventPhoneUpload from "./component/EventPhoneUpload/EventPhoneUpload.jsx";
import CreateAlbum from "./component/AllTheEvents/CreateAlbum/CreateAlbum.jsx";
import YourAlbum from "./component/AllTheEvents/Allbums/YourAlbum.jsx";
import AllAlbums from "./component/AllTheEvents/Allbums/AllAlbums.jsx";
import UpdateProfile from "./Library/UpdateProfile.jsx";
import VerifyPassword from "./Library/VerifyPassword.jsx";
import ForgotPassword from "./component/ForgotPassword.jsx"; // ייבוא רכיב שכחתי סיסמה
import ResetPassword from "./component/ResetPassword/ResetPassword.jsx";
import { UserContext } from "./hooks/UserHooks/userContextApp";

const allowedPaths = [
  "/",
  "/FAQ",
  "/register",
  "/packages",
  "/regular-packages", // נתיב נוסף לחבילות רגילות
  "/CreateAlbum",
  "/all-albums",
  "/update-profile",
  "//update-profile/edit",
  "verify-password",
  "/selfie/:albumId",
  "/your-album/:albumId",
  "/matched-images/:albumId/:userId",
  "/forgot-password", // נתיב לבקשת איפוס סיסמה
  "/reset-password/:token", // נתיב לאיפוס סיסמה באמצעות טוקן
];

const AppRoutes = ({ searchQuery }) => {
  const { userInformation } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAllowed = allowedPaths.some((path) => {
      if (path.includes(":albumId") && path.includes(":userId")) {
        return location.pathname.startsWith("/matched-images/");
      }
      if (path.includes(":albumId")) {
        return (
          location.pathname.startsWith("/your-album/") ||
          location.pathname.startsWith("/selfie/")
        );
      }
      if (path.includes(":token")) {
        return location.pathname.startsWith("/reset-password/");
      }
      return path === location.pathname;
    });

    // בדיקת הרשאות לחבילות רגילות
    if (
      userInformation?.role !== "user" &&
      location.pathname === "/regular-packages"
    ) {
      navigate("/packages");
      return;
    }

    // הוספת בדיקה ספציפית לנתיב אימות הסיסמה ו-UpdateProfile
    if (
      location.pathname === "/update-profile" ||
      location.pathname === "/update-profile/edit"
    ) {
      return; // לא מבצע ניתוב אם הנתיב הוא חלק מעדכון הפרופיל
    }

    // בדיקת הרשאות לכל הנתיבים שאינם ב-allowedPaths
    if (userInformation && !isAllowed) {
      navigate("/CreateAlbum");
    } else if (!userInformation && !isAllowed) {
      navigate("/register");
    }
  }, [userInformation, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<EventImageUpload />} />
      <Route path="/selfie/:albumId" element={<Selfie />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/regular-packages" element={<RegularPackages />} />
      <Route path="/EventPhoneUpload" element={<EventPhoneUpload />} />
      <Route path="/CreateAlbum" element={<CreateAlbum />} />
      <Route path="/all-albums" element={<AllAlbums />} />
      <Route path="/your-album/:albumId" element={<YourAlbum />} />
      <Route
        path="/update-profile"
        element={<VerifyPassword redirectPath="/update-profile/edit" />}
      />
      <Route path="/update-profile/edit" element={<UpdateProfile />} />
      <Route
        path="/matched-images/:albumId/:userId"
        element={<MatchedImages />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
