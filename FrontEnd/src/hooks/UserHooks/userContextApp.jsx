// userContextApp.js (אם זה קובץ ה-UserContext שלך)
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider"; // עדכן את הנתיב בהתאם למיקום הקובץ שלך

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null);
  const apiUrl = useApiUrl();

  useEffect(() => {
    const token = localStorage.getItem("token"); // שליפת הטוקן מ-localStorage
    if (token) {
      // בדיקה אם יש טוקן
      axios
        .get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((response) => {
          setUserInformation(response.data); // שמירת פרטי המשתמש
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
          setUserInformation(null); // איפוס פרטי המשתמש במקרה של שגיאה
          localStorage.removeItem("token"); // ניקוי הטוקן במקרה של טעות
        });
    }
  }, [apiUrl]);

  return (
    <UserContext.Provider value={{ userInformation, setUserInformation }}>
      {children}
    </UserContext.Provider>
  );
};
