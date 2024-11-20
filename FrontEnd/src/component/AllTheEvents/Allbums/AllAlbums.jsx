import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import { useNavigate } from "react-router-dom";
import styles from "./AllAlbums.module.css";

const AllAlbums = () => {
  const apiUrl = useApiUrl();
  const { userInformation, loading } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  const fetchAllAlbums = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/albums`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlbums(response.data);
    } catch (error) {
      console.error("Error fetching albums:", error.response || error);
      setError("Failed to load albums.");
    }
  }, [apiUrl, token]);

  useEffect(() => {
    if (userInformation && !loading) {
      fetchAllAlbums();
    }
  }, [fetchAllAlbums, userInformation, loading]);

  const handleCreateAlbum = () => {
    if (userInformation?.role === "user" && albums.length > 0) {
      alert(
        "You can only create one album as a regular user. Upgrade your account to create more albums."
      );
      return;
    }
    navigate("/CreateAlbum");
  };

  const handleViewAlbum = async (albumId) => {
    const viewedAlbums = JSON.parse(localStorage.getItem("viewedAlbums")) || [];

    if (!viewedAlbums.includes(albumId)) {
      localStorage.setItem(
        "viewedAlbums",
        JSON.stringify([...viewedAlbums, albumId])
      );

      try {
        await axios.get(`${apiUrl}/api/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error viewing album:", error.response || error);
      }
    }

    navigate(`/your-album/${albumId}`);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/api/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlbums((prevAlbums) =>
        prevAlbums.filter((album) => album._id !== albumId)
      );
      alert("Album deleted successfully.");
    } catch (error) {
      console.error("Error deleting album:", error.response || error);
      alert("Failed to delete album. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>All Your Albums</h2>
      <button
        className={styles.createButton}
        onClick={handleCreateAlbum} // מניעת יצירת אלבום נוסף
      >
        Create New Album
      </button>
      <div className={styles.albumsGrid}>
        {albums.map((album) => (
          <div key={album._id} className={styles.albumCard}>
            {album.coverImage && album.coverImage.data ? (
              <img
                src={`data:${album.coverImage.contentType};base64,${album.coverImage.data}`}
                alt="Cover"
                className={styles.coverImage}
              />
            ) : (
              <p className={styles.noCoverText}>No cover image available</p>
            )}
            <h3 className={styles.albumTitle}>{album.eventName}</h3>
            <p className={styles.albumDetails}>
              <strong>Location:</strong> {album.location}
            </p>
            <p className={styles.albumDetails}>
              <strong>Date:</strong> {new Date(album.date).toLocaleDateString()}
            </p>
            <p className={styles.albumDetails}>
              <strong>Type:</strong> {album.eventType}
            </p>
            <p className={styles.albumDetails}>
              <strong>Guests:</strong> {album.numberOfGuests || 0}
            </p>
            <p className={styles.albumDetails}>
              <strong>Views:</strong> {album.views || 0}
            </p>
            <p className={styles.albumDetails}>
              <strong>Privacy:</strong> {album.isPrivate ? "Private" : "Public"}
            </p>
            <button
              className={styles.viewButton}
              onClick={() => handleViewAlbum(album._id)}
            >
              View Album
            </button>
            <button
              className={styles.faceRecognitionButton}
              onClick={() => navigate(`/selfie/${album._id}`)}
            >
              Face Recognition
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteAlbum(album._id)}
            >
              Delete Album
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAlbums;
