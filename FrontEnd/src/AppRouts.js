import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "./component/About/About";
import Register from "./component/Register/Register";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
import Selfie from "./component/Momentimg/Selfie.jsx";
import Packages from "./component/Packages/Packages.jsx";
import EventPhoneUpload from "./component/EventPhoneUpload/EventPhoneUpload.jsx";
import CreateEvent from "./component/AllTheEvents/CreateEvent.jsx";
// import FindTheOne from "./component/FindeTheOne/FindTheOne.jsx";

const AppRoutes = ({ searchQuery }) => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<EventImageUpload />} />
      <Route path="/selfie" element={<Selfie />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/EventPhoneUpload" element={<EventPhoneUpload />} />
      <Route path="/CreateEvent" element={<CreateEvent />} />
      {/* <Route
        path="/FindTheOne"
        element={<FindTheOne searchQuery={searchQuery} />}
      /> */}
    </Routes>
  );
};

export default AppRoutes;
