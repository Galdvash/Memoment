// src/components/AllTheEvents/YourAlbum.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";

const YourAlbum = () => {
  const { albumId } = useParams();
  const apiUrl = useApiUrl();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching album with ID:", albumId); // בדיקה בקונסול
    if (!albumId) {
      setError("No album ID provided.");
      return;
    }

    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/albums/${albumId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAlbum(response.data);
      } catch (error) {
        console.error("Error fetching album:", error);
        setError("Failed to load album.");
      }
    };

    fetchAlbum();
  }, [apiUrl, albumId, token]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{album.eventName}</h2>
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

      <div>
        <h3>תמונת שער</h3>
        {album.coverImage && (
          <img
            src={`data:${album.coverImage.contentType};base64,${album.coverImage.data}`}
            alt="Cover"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        )}
      </div>

      <div>
        <h3>תמונות</h3>
        {album.images && album.images.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {album.images.map((image, index) => (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img
                key={index}
                src={`data:${image.contentType};base64,${image.data}`}
                alt={`Image ${index + 1}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3>קובץ רשימת אורחים</h3>
        {album.guestListFile && (
          <a
            href={`data:${album.guestListFile.contentType};base64,${album.guestListFile.data}`}
            download={album.guestListFile.filename}
          >
            הורד רשימת אורחים
          </a>
        )}
      </div>

      {/* הוספת כפתור חזרה ל-AllAlbums */}
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
