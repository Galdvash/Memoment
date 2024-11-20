import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./EditUser.module.css";

const EditUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/admin/users/${userId}/details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data.user);
        setRole(response.data.user.role);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      await axios.put(
        `/api/admin/users/${userId}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/admin");
    } catch (error) {
      console.error("Error saving user role:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.editUser}>
      <h1>Edit User</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <label>
        <strong>Role:</strong>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={styles.roleSelect}
        >
          <option value="user">User</option>
          <option value="business">Business</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button className={styles.saveButton} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditUser;
