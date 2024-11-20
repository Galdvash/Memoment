import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import styles from "./YourAlbum.module.css";
const YourAlbum = () => {
  const { albumId } = useParams();
  const apiUrl = useApiUrl();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null); // נתוני האלבום
  const [error, setError] = useState(null); // שגיאות
  const [isEditing, setIsEditing] = useState(false); // מצב עריכה
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    date: "",
    eventType: "",
    isPrivate: false,
  });
  const preparePhotos = (images) => {
    if (!images || images.length === 0) {
      return [];
    }
    return images.map((image) => ({
      src: `data:${image.contentType};base64,${image.data}`,
    }));
  };
  // טעינת נתוני האלבום מהשרת
  useEffect(() => {
    if (!albumId) {
      setError("No album ID provided.");
      return;
    }

    const fetchAlbum = async () => {
      try {
        setLoading(true); // התחלת טעינה
        const response = await axios.get(`${apiUrl}/api/albums/${albumId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Album Data:", response.data); // הדפסת הנתונים

        // עיבוד התמונות
        const photos = preparePhotos(response.data.images || []);

        setAlbum({
          ...response.data,
          photos, // הוספת התמונות המעובדות
        });

        // עדכון הטופס
        setFormData({
          eventName: response.data.eventName || "",
          location: response.data.location || "",
          date: response.data.date || "",
          eventType: response.data.eventType || "",
          isPrivate: response.data.isPrivate || false,
        });
      } catch (error) {
        console.error("Error fetching album:", error);
        setError("Failed to load album.");
      } finally {
        setLoading(false); // סיום טעינה
      }
    };

    fetchAlbum();
  }, [apiUrl, albumId, token]);

  // עדכון שדות הטופס
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // שמירת שינויים
  const handleSave = async () => {
    try {
      const updatedAlbum = { ...formData };

      await axios.put(`${apiUrl}/api/albums/${albumId}`, updatedAlbum, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlbum((prev) => ({ ...prev, ...updatedAlbum }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating album:", error);
      setError("Failed to update album.");
    }
  };

  // טעינה או שגיאה
  if (loading) {
    return <div>טוען נתונים...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>{isEditing ? "עריכת אלבום" : album.eventName}</h2>
      {isEditing ? (
        <div className={styles.editForm}>
          <label>
            שם האירוע:
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            מיקום:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </label>
          <label>
            תאריך:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </label>
          <label>
            סוג האירוע:
            <input
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
            />
          </label>
          <label>
            פרטי:
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave}>שמור</button>
          <button onClick={() => setIsEditing(false)}>ביטול</button>
        </div>
      ) : (
        <div>
          <p>
            <strong>מיקום:</strong> {album.location}
          </p>
          <p>
            <strong>תאריך:</strong> {new Date(album.date).toLocaleDateString()}
          </p>
          <p>
            <strong>סוג האירוע:</strong> {album.eventType}
          </p>
          <p>
            <strong>פרטיות:</strong> {album.isPrivate ? "פרטי" : "ציבורי"}
          </p>
          <button onClick={() => setIsEditing(true)}>ערוך</button>
          <div>
            <h3>גלריית תמונות</h3>
            {album.photos && album.photos.length > 0 ? (
              <div className={styles.photoGallery}>
                {album.photos.map((photo, index) => (
                  <div key={index} className={styles.photoContainer}>
                    <img
                      src={photo.src}
                      alt={`Album  ${index + 1}`}
                      className={styles.photo}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>לא נמצאו תמונות באלבום</p>
            )}
          </div>
        </div>
      )}

      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/all-albums")}
      >
        View All Albums
      </button>
    </div>
  );
};

export default YourAlbum;
