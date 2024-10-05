// App.js

import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./component/Navbar/Navbar";
import About from "./component/About/About";
import FindTheOne from "./component/FindTheOne/FindTheOne";
import FavoritCards from "./component/FavoritCards/FavoritCards";
import Register from "./component/Register/Register";
import MyCards from "./component/Cards/Cards";
import SandBox from "./component/SandBox/SandBox";
// import Footer from "./component/Footer/Footer";
import { ThemeProvider } from "./hooks/DarkMode/DarkModeContext";
import { UserProvider } from "./hooks/UserHooks/userContextApp";
import EventImageUpload from "./component/Momentimg/EventImageUpload.jsx";
import SelfieUpload from "./component/Momentimg/SelfieUpload.jsx";
import "./hooks/DarkMode/DarkMode.css";
import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <NavBar onSearch={handleSearch} />
          <Routes>
            <Route path="/" element={<About />} />
            <Route
              path="/FindTheOne"
              element={<FindTheOne searchQuery={searchQuery} />}
            />
            <Route path="/favCards" element={<FavoritCards />} />
            <Route path="/myCards" element={<MyCards />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sandBox" element={<SandBox />} />
            <Route path="/upload" element={<EventImageUpload />} />
            <Route path="/selfie" element={<SelfieUpload />} />
          </Routes>
          {/* <Footer /> */}
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
