import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    try {
      const response = await axios.get(`/api/admin/users/${userId}/details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAlbums(response.data.albums);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/edit-user/${userId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className={styles.userRow}
            >
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditUser(user._id);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && albums.length > 0 && (
        <div className={styles.userDetails}>
          <h2>Albums for User</h2>
          <table className={styles.albumsTable}>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Created At</th>
                <th>Images</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album) => (
                <tr key={album._id}>
                  <td>{album.eventName}</td>
                  <td>{new Date(album.createdAt).toLocaleDateString()}</td>
                  <td>{album.images.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
