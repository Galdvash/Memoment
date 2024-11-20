// App.js
import React, { useState, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./component/Navbar/Navbar";
import AppRoutes from "./AppRoutes";
import Dashboard from "./Library/Dashboard";

import { ThemeProvider } from "./hooks/DarkMode/DarkModeContext";
import { UserProvider, UserContext } from "./hooks/UserHooks/userContextApp";
import { ApiProvider } from "./hooks/ApiUrl/ApiProvider";
import "./hooks/DarkMode/DarkMode.css";
import "./App.css";

const AppContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { userInformation, loading } = useContext(UserContext);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) return <div>Loading...</div>; // אפשר להוסיף spinner או משהו אחר

  const isAdminOrBusiness =
    userInformation?.role === "admin" || userInformation?.role === "business";

  const isRegularOrGuest =
    !userInformation ||
    (userInformation?.role !== "admin" && userInformation?.role !== "business");

  return (
    <>
      {isAdminOrBusiness && <Dashboard />}
      {isRegularOrGuest && <NavBar onSearch={handleSearch} />}
      <AppRoutes searchQuery={searchQuery} />
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <ApiProvider>
            <AppContent />
          </ApiProvider>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
