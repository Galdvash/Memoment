import React, { useState, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./component/Navbar/Navbar";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "./hooks/DarkMode/DarkModeContext";
import { UserProvider, UserContext } from "./hooks/UserHooks/userContextApp";
import { ApiProvider } from "./hooks/ApiUrl/ApiProvider";
import "./hooks/DarkMode/DarkMode.css";
import "./App.css";

const AppContent = ({ searchQuery, setSearchQuery }) => {
  const { userInformation } = useContext(UserContext);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      {!(
        userInformation?.role === "business" ||
        userInformation?.role === "admin"
      ) && <NavBar onSearch={handleSearch} />}
      <AppRoutes searchQuery={searchQuery} />
    </>
  );
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <UserProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <ApiProvider>
            <AppContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </ApiProvider>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
