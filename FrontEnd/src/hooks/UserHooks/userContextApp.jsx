import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null);

  useEffect(() => {
    // בדיקת אם יש טוקן ב-localStorage
    const token = localStorage.getItem("token");

    // נבצע את הקריאה ל-API רק אם יש טוקן
    if (token) {
      axios
        .get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`, // מוסיפים את הטוקן לכותרת Authorization
          },
          withCredentials: true,
        })
        .then((response) => {
          setUserInformation(response.data); // שמירת המידע על המשתמש
        })
        .catch((error) => {
          console.error("Error:", error);
          localStorage.removeItem("token");
          setUserInformation(null);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInformation, setUserInformation }}>
      {children}
    </UserContext.Provider>
  );
};
