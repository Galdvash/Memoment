import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import About from "./component/About/About";
import FAQ from "./component/Q&A/FAQ.jsx";
import Register from "./component/Register/Register";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
import Selfie from "./component/Momentimg/Selfie.jsx";
import Packages from "./component/Packages/Packages.jsx";
import EventPhoneUpload from "./component/EventPhoneUpload/EventPhoneUpload.jsx";
import CreateEvent from "./component/AllTheEvents/CreateEvent.jsx";
import { UserContext } from "./hooks/UserHooks/userContextApp";

const AppRoutes = ({ searchQuery }) => {
  const { userInformation } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if the user is logged in and revisits the site
    if (userInformation) {
      navigate("/CreateEvent"); // Change "/dashboard" to your actual dashboard path
    }
  }, [userInformation, navigate]);

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
    </Routes>
  );
};

export default AppRoutes;
