// src/components/ForgotPassword/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useApiUrl } from "../hooks/ApiUrl/ApiProvider"; // ייבוא ה-hook לשימוש ב-apiUrl

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const apiUrl = useApiUrl(); // שימוש במשתנה apiUrl

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/users/forgot-password`, {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending email");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>שכחת את הסיסמה?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="הכנס את כתובת המייל שלך"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">שלח קישור לאיפוס סיסמה</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
