import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import About from "./component/About/About";
import FAQ from "./component/Q&A/FAQ.jsx";
import Register from "./component/Register/Register";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
import Selfie from "./component/Momentimg/Selfie.jsx";
import Packages from "./component/Packages/Packages.jsx";
import EventPhoneUpload from "./component/EventPhoneUpload/EventPhoneUpload.jsx";
import CreateEvent from "./component/AllTheEvents/CreateEvent.jsx";
import YourAlbum from "./component/AllTheEvents/Allbums/YourAlbum.jsx";
import AllAlbums from "./component/AllTheEvents/Allbums/AllAlbums.jsx";
import { UserContext } from "./hooks/UserHooks/userContextApp";

const allowedPaths = ["/", "/your-album/:albumId", "/all-albums"];
const AppRoutes = ({ searchQuery }) => {
  const { userInformation } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAllowed = allowedPaths.some((path) => {
      if (path.includes(":albumId")) {
        return location.pathname.startsWith("/your-album/");
      }
      return path === location.pathname;
    });

    if (userInformation && !isAllowed) {
      navigate("/CreateEvent");
    }
  }, [userInformation, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<EventImageUpload />} />
      <Route path="/selfie" element={<Selfie />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/EventPhoneUpload" element={<EventPhoneUpload />} />
      <Route path="/CreateEvent" element={<CreateEvent />} />
      <Route path="/all-albums" element={<AllAlbums />} />{" "}
      {/* הוסף את הנתיב ל-AllAlbums */}
      <Route path="/your-album/:albumId" element={<YourAlbum />} />
    </Routes>
  );
};

export default AppRoutes;
