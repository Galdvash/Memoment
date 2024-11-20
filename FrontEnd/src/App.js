// App.js
import React, { useState, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./component/Navbar/Navbar";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "./hooks/DarkMode/DarkModeContext";
import { UserProvider, UserContext } from "./hooks/UserHooks/userContextApp";
import { ApiProvider } from "./hooks/ApiUrl/ApiProvider";
import "./hooks/DarkMode/DarkMode.css";
import "./App.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { userInformation } = useContext(UserContext) || {}; // מוסיף בדיקה אם ה-context קיים

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const shouldShowNavBar =
    userInformation && !["business", "admin"].includes(userInformation.role);

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <UserProvider>
        <ThemeProvider>
          <ApiProvider>
            {shouldShowNavBar && <NavBar onSearch={handleSearch} />}
            <AppRoutes searchQuery={searchQuery} />
          </ApiProvider>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
