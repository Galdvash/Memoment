// userContextApp.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null);
  const apiUrl = useApiUrl();

  useEffect(() => {
    // Fetch user information if a session is active
    axios
      .get(`${apiUrl}/api/users/me`, {
        withCredentials: true, // Ensures the cookie is sent with the request
      })
      .then((response) => {
        setUserInformation(response.data); // Set user info if authenticated
      })
      .catch((error) => {
        console.error("Error fetching user information:", error);
        setUserInformation(null); // Reset if there's an error (e.g., not logged in)
      });
  }, [apiUrl]);

  return (
    <UserContext.Provider value={{ userInformation, setUserInformation }}>
      {children}
    </UserContext.Provider>
  );
};
