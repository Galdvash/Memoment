import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./component/Navbar/Navbar";
import AppRoutes from "./AppRouts"; // נייבא את ה־Routes החדשים
import { ThemeProvider } from "./hooks/DarkMode/DarkModeContext";
import { UserProvider } from "./hooks/UserHooks/userContextApp";
import "./hooks/DarkMode/DarkMode.css";
import "./App.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="appBody">
      <ThemeProvider>
        <UserProvider>
          <BrowserRouter>
            <NavBar onSearch={handleSearch} />
            <AppRoutes searchQuery={searchQuery} /> {/* שימוש ב־AppRoutes */}
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
