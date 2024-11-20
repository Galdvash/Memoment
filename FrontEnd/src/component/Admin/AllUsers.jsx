import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AllUsers.module.css";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";
import LodingCamera from "../../Library/LoadingCamera"; // עדכן את הנתיב בהתאם למיקום הקובץ

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [albums, setAlbums] = useState([]); // לאחסון האלבומים של משתמש מסוים
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null); // לעריכה
  const [selectedUserForAlbums, setSelectedUserForAlbums] = useState(null); // לאלבומים

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
  }); // נתוני העריכה

  const apiUrl = useApiUrl(); // הגדר את כתובת ה-API שלך
  const [loading, setLoading] = useState(false); // הוספנו מצב טעינה

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // התחל טעינה

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error(
          "Error fetching users:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false); // סיים טעינה
      }
    };

    fetchUsers();
  }, [apiUrl]);

  const fetchAlbums = async (userId) => {
    if (selectedUserForAlbums === userId) {
      // אם המשתמש כבר נבחר, סגור את רשימת האלבומים
      setSelectedUserForAlbums(null);
      setAlbums([]);
    } else {
      setLoading(true); // התחל טעינה

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiUrl}/api/admin/users/${userId}/albums`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAlbums(response.data);
        setSelectedUserForAlbums(userId); // הגדרת המשתמש הנבחר לאלבומים
      } catch (error) {
        console.error(
          "Error fetching albums:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false); // סיים טעינה
      }
    }
  };

  const handleEditClick = (user) => {
    if (selectedUserForEdit === user._id) {
      // סגור את טופס העריכה אם המשתמש כבר נבחר
      setSelectedUserForEdit(null);
      setEditFormData({
        name: "",
        email: "",
        phoneNumber: "",
        role: "",
      });
    } else {
      // פתח את טופס העריכה למשתמש שנבחר
      setSelectedUserForEdit(user._id);
      setEditFormData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        role: user.role,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true); // התחל טעינה

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/api/admin/users/${selectedUserForEdit}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUserForEdit ? { ...user, ...editFormData } : user
        )
      );
      setSelectedUserForEdit(null); // סגירת טופס העריכה
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // סיים טעינה
    }
  };
  if (loading) return <LodingCamera />;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>כל המשתמשים</h1>
      <div className={styles.users}>
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user._id} className={styles.userItem}>
              <span>שם: {user.name}</span>
              <span>אימייל: {user.email}</span>
              <span>טלפון: {user.phoneNumber || "לא זמין"}</span>
              <span>תפקיד: {user.role}</span>
              <button onClick={() => fetchAlbums(user._id)}>
                {selectedUserForAlbums === user._id
                  ? "סגור אלבומים"
                  : "ראה אלבומים"}
              </button>
              <button onClick={() => handleEditClick(user)}>
                {selectedUserForEdit === user._id ? "סגור עריכה" : "ערוך"}
              </button>

              {/* הצגת טופס העריכה מעל המשתמש הנבחר */}
              {selectedUserForEdit === user._id && (
                <div className={styles.editForm}>
                  <h2>ערוך משתמש</h2>
                  <label>
                    שם:
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    אימייל:
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    טלפון:
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editFormData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    תפקיד:
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleInputChange}
                    >
                      <option value="user">משתמש</option>
                      <option value="business">עסק</option>
                      <option value="admin">אדמין</option>
                    </select>
                  </label>
                  <button onClick={handleSave}>שמור</button>
                </div>
              )}

              {/* הצגת האלבומים של המשתמש */}
              {selectedUserForAlbums === user._id && (
                <div className={styles.albums}>
                  <h2>אלבומים של משתמש</h2>
                  {albums.length > 0 ? (
                    <ul className={styles.albumList}>
                      {albums.map((album) => (
                        <li key={album._id} className={styles.albumItem}>
                          <h3>{album.eventName}</h3>
                          <p>
                            תאריך: {new Date(album.date).toLocaleDateString()}
                          </p>
                          <p>מיקום: {album.location}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>אין אלבומים למשתמש זה.</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllUsers;
