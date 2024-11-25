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
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <h3 className={styles.albumDetailsTitle}>
          {isEditing ? "Edit Album" : album.eventName}
        </h3>
        {isEditing ? (
          <div className={styles.editForm}>
            <h2 className={styles.title}>Edit Album</h2>
            <label>
              Album Name:
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <label>
              Album Type:
              <input
                type="text"
                name="albumType"
                value={formData.albumType}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <label>
              Private:
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
              />
            </label>

            <div className={styles.buttons}>
              <>
                <button onClick={handleSave} className={styles.button}>
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={styles.button}
                >
                  Cancel
                </button>
              </>
            </div>
          </div>
        ) : (
          <div className={styles.details}>
            <p>
              <strong>Album Name:</strong> {album.eventName}
            </p>
            <p>
              <strong>Location:</strong> {album.location}
            </p>
            <p>
              <strong>Date:</strong> {new Date(album.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Album Type:</strong> {album.albumType}
            </p>
            <p>
              <strong>Privacy:</strong> {album.isPrivate ? "Private" : "Public"}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.button}
            >
              Edit
            </button>
            <button
              onClick={() => navigate("/all-albums")}
              className={styles.backButton}
            >
              View All Albums
            </button>
          </div>
        )}
      </div>

      <div className={styles.albumContainer}>
        <h2 className={styles.title}>Photo Gallery</h2>
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
          <p className={styles.noPhotos}>No photos found in the album</p>
        )}
      </div>
    </div>
  );
};

export default YourAlbum;
