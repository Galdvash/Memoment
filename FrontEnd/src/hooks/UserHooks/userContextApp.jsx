// hooks/UserHooks/userContextApp.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useApiUrl } from "../ApiUrl/ApiProvider";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null); // שמירת מידע זמני על המשתמש
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // האם הסיסמה אומתה
  const apiUrl = useApiUrl();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserInformation(response.data); // עדכון המידע על המשתמש
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
          setUserInformation(null); // איפוס אם יש שגיאה
          localStorage.removeItem("token"); // מחיקת טוקן אם השגיאה היא טוקן לא תקין
        })
        .finally(() => {
          setLoading(false); // סיום טעינה
        });
    } else {
      setLoading(false); // סיום טעינה אם אין טוקן
    }
  }, [apiUrl]);

  return (
    <UserContext.Provider
      value={{
        userInformation,
        loading,
        isPasswordVerified,
        setIsPasswordVerified,
        setUserInformation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
