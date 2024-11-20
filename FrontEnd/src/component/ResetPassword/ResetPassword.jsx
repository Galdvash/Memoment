import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider"; // ייבוא ה-hook לשימוש ב-apiUrl

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // להנעת המשתמש לאחר איפוס מוצלח
  const apiUrl = useApiUrl(); // שימוש במשתנה apiUrl

  // פונקציה להערכת חוזק הסיסמה
  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength <= 2 ? "Weak" : strength === 3 ? "Medium" : "Strong";
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    setPasswordStrength(evaluatePasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength === "Weak") {
      setMessage("Password is too weak. Please use a stronger password.");
      return;
    }

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
          onChange={handlePasswordChange}
          required
        />
        {passwordStrength && (
          <p>
            Password Strength:{" "}
            <span
              style={{
                color:
                  passwordStrength === "Weak"
                    ? "red"
                    : passwordStrength === "Medium"
                    ? "orange"
                    : "green",
              }}
            >
              {passwordStrength}
            </span>
          </p>
        )}
        <button type="submit">אפס סיסמה</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
