// contexts/ApiContext.js
import React, { createContext, useContext } from "react";

// בוחרים את ה-URL לפי הסביבה הנוכחית
const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://memoment.onrender.com"
    : "http://localhost:5000";

const ApiContext = createContext(apiUrl);

export const ApiProvider = ({ children }) => {
  return <ApiContext.Provider value={apiUrl}>{children}</ApiContext.Provider>;
};

export const useApiUrl = () => useContext(ApiContext);
