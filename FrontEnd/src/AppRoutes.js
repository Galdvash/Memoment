import React from "react";
import { Route, Routes } from "react-router-dom";
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

const AppRoutes = () => {
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
      />
    </Routes>
  );
};

export default AppRoutes;
