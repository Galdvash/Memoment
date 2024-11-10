import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "./component/About/About";
import FindTheOne from "./component/FindTheOne/FindTheOne";
import Register from "./component/Register/Register";
import MyCards from "./component/Cards/Cards.jsx";
import SandBox from "./views/Admin/SandBox/SandBox.jsx";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
import SelfieUpload from "./component/Momentimg/SelfieUpload.jsx";
import Packages from "./component/Packages/Packages.jsx";
import EventPhoneUpload from "./component/EventPhoneUpload/EventPhoneUpload.jsx";
import CreateEvent from "./component/AllTheEvents/CreateEvent.jsx";
const AppRoutes = ({ searchQuery }) => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/myCards" element={<MyCards />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sandBox" element={<SandBox />} />
      <Route path="/upload" element={<EventImageUpload />} />
      <Route path="/selfie" element={<SelfieUpload />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/EventPhoneUpload" element={<EventPhoneUpload />} />
      <Route path="/CreateEvent" element={<CreateEvent />} />
      <Route
        path="/FindTheOne"
        element={<FindTheOne searchQuery={searchQuery} />}
      />
    </Routes>
  );
};

export default AppRoutes;
