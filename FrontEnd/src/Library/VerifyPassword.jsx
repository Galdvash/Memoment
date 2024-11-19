// src/components/User/VerifyPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApiUrl } from "../hooks/ApiUrl/ApiProvider";
import styles from "./VerifyPassword.module.css";

const VerifyPassword = ({ redirectPath }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = useApiUrl();
  const navigate = useNavigate();

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // אימות סיסמה מול השרת
      await axios.post(
        `${apiUrl}/api/users/verify-password`,
        { password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ניתוב לעמוד היעד
      navigate("/update-profile/edit");
    } catch (err) {
      setError(err.response?.data?.message || "סיסמה לא נכונה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>אימות סיסמה</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleVerifyPassword}>
        <label>
          סיסמה נוכחית:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "בודק..." : "אמת והמשך"}
        </button>
      </form>
    </div>
  );
};

export default VerifyPassword;
