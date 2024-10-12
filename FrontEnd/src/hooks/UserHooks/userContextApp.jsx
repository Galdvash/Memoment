import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null);

  useEffect(() => {
    // בקשת API לשרת כדי לבדוק אם המשתמש מחובר
    axios
      .get("http://localhost:5000/api/users/me", {
        withCredentials: true, // חשוב כדי לשלוח את ה-cookie לשרת
      })
      .then((response) => {
        setUserInformation(response.data); // שמירת פרטי המשתמש אם מחובר
      })
      .catch((error) => {
        console.error("Error:", error);
        setUserInformation(null); // איפוס פרטי המשתמש אם לא מחובר
      });
  }, []); // יבוצע פעם אחת כאשר הקומפוננטה נטענת

  return (
    <UserContext.Provider value={{ userInformation, setUserInformation }}>
      {children}
    </UserContext.Provider>
  );
};
