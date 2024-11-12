// contexts/ApiContext.js
import React, { createContext, useContext } from "react";

// בוחרים את ה-URL לפי הסביבה הנוכחית
const apiUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL_PRODUCTION
    : process.env.REACT_APP_API_URL_DEVELOPMENT;

const ApiContext = createContext(apiUrl);

export const ApiProvider = ({ children }) => {
  return <ApiContext.Provider value={apiUrl}>{children}</ApiContext.Provider>;
};

export const useApiUrl = () => useContext(ApiContext);
