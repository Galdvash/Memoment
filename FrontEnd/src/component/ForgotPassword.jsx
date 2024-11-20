// src/components/ForgotPassword/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useApiUrl } from "../hooks/ApiUrl/ApiProvider"; // ייבוא ה-hook לשימוש ב-apiUrl
import styleForgotPass from "./ForgotPassword.module.css";
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
    <div className={styleForgotPass["forgot-password-container"]}>
      <div className={styleForgotPass.warpper}>
        <h2>Forgot Your Password ?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Your Email Here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styleForgotPass.input}
          />
          <button type="submit" className={styleForgotPass.button}>
            Send Request To Verify Email{" "}
          </button>
        </form>
        {message && <p className={styleForgotPass.message}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
