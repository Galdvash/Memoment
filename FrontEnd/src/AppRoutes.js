import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import About from "./component/About/About";
import FAQ from "./component/Q&A/FAQ.jsx";
import Register from "./component/Register/Register";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
import Selfie from "./component/Selfie/Selfie.jsx";
import MatchedImages from "./component/Selfie/MatchedImages.jsx";
import Packages from "./component/Packages/Packages.jsx";
import EventPhoneUpload from "./component/EventPhoneUpload/EventPhoneUpload.jsx";
import CreateAlbum from "./component/AllTheEvents/CreateAlbum/CreateAlbum.jsx";
import YourAlbum from "./component/AllTheEvents/Allbums/YourAlbum.jsx";
import AllAlbums from "./component/AllTheEvents/Allbums/AllAlbums.jsx";
import { UserContext } from "./hooks/UserHooks/userContextApp";

const allowedPaths = [
  "/",
  "/FAQ",
  "/register",
  "/packages",
  "/CreateAlbum",
  "/all-albums",
  "/selfie/:albumId",
  "/your-album/:albumId",
  "/matched-images/:albumId/:userId", // הוסף את הנתיב הזה
];

const AppRoutes = ({ searchQuery }) => {
  const { userInformation } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const isAllowed = allowedPaths.some((path) => {
      if (path.includes(":albumId") && path.includes(":userId")) {
        if (path.startsWith("/matched-images/")) {
          return location.pathname.startsWith("/matched-images/");
        }
      }
      if (path.includes(":albumId")) {
        if (path.startsWith("/your-album/")) {
          return location.pathname.startsWith("/your-album/");
        }
        if (path.startsWith("/selfie/")) {
          return location.pathname.startsWith("/selfie/");
        }
      }
      return path === location.pathname;
    });

    if (userInformation && !isAllowed) {
      navigate("/CreateAlbum");
    }
  }, [userInformation, navigate, location.pathname]);
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<EventImageUpload />} />
      <Route path="/selfie/:albumId" element={<Selfie />} />{" "}
      {/* Selfie route */}
      <Route path="/packages" element={<Packages />} />
      <Route path="/EventPhoneUpload" element={<EventPhoneUpload />} />
      <Route path="/CreateAlbum" element={<CreateAlbum />} />
      <Route path="/all-albums" element={<AllAlbums />} />
      <Route path="/your-album/:albumId" element={<YourAlbum />} />
      <Route
        path="/matched-images/:albumId/:userId"
        element={<MatchedImages />} // וודא שהקומפוננטה קיימת
      />{" "}
    </Routes>
  );
};

export default AppRoutes;
