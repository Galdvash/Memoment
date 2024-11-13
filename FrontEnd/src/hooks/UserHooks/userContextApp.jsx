// userContextApp.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null);
  const apiUrl = useApiUrl();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserInformation(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
          setUserInformation(null);
        });
    }
  }, [apiUrl]);

  return (
    <UserContext.Provider value={{ userInformation, setUserInformation }}>
      {children}
    </UserContext.Provider>
  );
};
