// hooks/UserHooks/userContextApp.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null);
  const [loading, setLoading] = useState(true); // מצב טעינה
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
        })
        .finally(() => {
          setLoading(false); // סיום טעינה
        });
    } else {
      setLoading(false); // סיום טעינה אם אין Token
    }
  }, [apiUrl]);

  return (
    <UserContext.Provider
      value={{ userInformation, loading, setUserInformation }}
    >
      {children}
    </UserContext.Provider>
  );
};
