// src/components/User/UpdateProfile.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApiUrl } from "../hooks/ApiUrl/ApiProvider";
import styles from "./UpdateProfile.module.css";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const apiUrl = useApiUrl();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(
        `${apiUrl}/api/users/update-name`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // עדכון הטוקן במידה והשם השתנה
      localStorage.setItem("token", response.data.token);
      setSuccess("השם עודכן בהצלחה");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בעדכון השם");
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(
        `${apiUrl}/api/users/update-email`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      setSuccess("האימייל עודכן בהצלחה");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בעדכון האימייל");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/api/users/update-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("הסיסמה עודכנה בהצלחה");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בעדכון הסיסמה");
    }
  };

  return (
    <div className={styles.container}>
      <h2>עדכון פרטי משתמש</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleNameUpdate} className={styles.form}>
        <h3>עדכון שם</h3>
        <label>
          שם חדש:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">עדכן שם</button>
      </form>

      <form onSubmit={handleEmailUpdate} className={styles.form}>
        <h3>עדכון אימייל</h3>
        <label>
          אימייל חדש:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">עדכן אימייל</button>
      </form>

      <form onSubmit={handlePasswordUpdate} className={styles.form}>
        <h3>עדכון סיסמה</h3>
        <label>
          סיסמה נוכחית:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          סיסמה חדשה:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          אישור סיסמה חדשה:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">עדכן סיסמה</button>
      </form>

      <button
        onClick={() => navigate("/profile")}
        className={styles.backButton}
      >
        חזור לפרופיל
      </button>
    </div>
  );
};

export default UpdateProfile;
