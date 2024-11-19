// components/ResetPassword/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider"; // ייבוא ה-hook לשימוש ב-apiUrl

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // להנעת המשתמש לאחר איפוס מוצלח
  const apiUrl = useApiUrl(); // שימוש במשתנה apiUrl

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/users/reset-password`, {
        resetToken: token,
        newPassword,
      });
      setMessage(response.data.message);
      // ניתוב לממשק ההתחברות לאחר איפוס מוצלח
      navigate("/login"); // ודא שיש נתיב /login
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>איפוס סיסמה</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="הכנס סיסמה חדשה"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">אפס סיסמה</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
