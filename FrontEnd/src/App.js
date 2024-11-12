import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./component/Navbar/Navbar";
import AppRoutes from "./AppRouts";
import { ThemeProvider } from "./hooks/DarkMode/DarkModeContext";
import { UserProvider } from "./hooks/UserHooks/userContextApp";
import { ApiProvider } from "./hooks/ApiUrl/ApiProvider";
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
          <ApiProvider>
            {" "}
            {/* הוסף את ApiProvider כאן */}
            <BrowserRouter>
              <NavBar onSearch={handleSearch} />
              <AppRoutes searchQuery={searchQuery} />
            </BrowserRouter>
          </ApiProvider>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
