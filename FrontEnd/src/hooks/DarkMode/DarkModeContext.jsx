import React, { createContext, useState, useEffect } from "react";
import "./DarkMode.css";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isSun, setIsSun] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });

  const handleIconClick = () => {
    setIsSun(!isSun);
  };

  useEffect(() => {
    if (isSun) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isSun]);

  return (
    <ThemeContext.Provider value={{ isSun, handleIconClick }}>
      {children}
    </ThemeContext.Provider>
  );
};
