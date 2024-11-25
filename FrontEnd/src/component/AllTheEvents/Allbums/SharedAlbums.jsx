import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import styleAlbums from "./SharedAlbums.module.css";
import { useNavigate } from "react-router-dom";

const SharedAlbums = () => {
  const apiUrl = useApiUrl();
  const { userInformation } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [sharedAlbums, setSharedAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedAlbums = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/albums/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSharedAlbums(response.data);
      } catch (error) {
        console.error("Error fetching shared albums:", error.response || error);
        setError("Failed to load shared albums.");
      } finally {
        setLoading(false);
      }
    };

    if (userInformation) {
      fetchSharedAlbums();
    }
  }, [apiUrl, userInformation, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styleAlbums.error}>{error}</div>;
  }

  if (sharedAlbums.length === 0) {
    return (
      <div className={styleAlbums.noAlbums}>
        <p>No albums have been shared with you.</p>
      </div>
    );
  }

  return (
    <div className={styleAlbums.container}>
      <h2 className={styleAlbums.heading}>Shared Albums</h2>
      <div className={styleAlbums.albumsGrid}>
        {sharedAlbums.map((album) => (
          <div key={album._id} className={styleAlbums.albumCard}>
            {/* תמונה עם עיצוב ייחודי */}
            <div className={styleAlbums.imageContainer}>
              {album.coverImage && album.coverImage.data ? (
                <img
                  src={`data:${album.coverImage.contentType};base64,${album.coverImage.data}`}
                  alt="Cover"
                  className={styleAlbums.coverImage}
                />
              ) : (
                <p className={styleAlbums.noCoverText}>
                  No cover image available
                </p>
              )}
              <p className={styleAlbums.locationText}>{album.location}</p>
            </div>
            {/* פרטי האלבום */}
            <h3 className={styleAlbums.albumTitle}>{album.eventName}</h3>
            <p className={styleAlbums.albumDetails}>
              <strong>Date:</strong> {new Date(album.date).toLocaleDateString()}
            </p>
            <p className={styleAlbums.albumDetails}>
              <strong>Type:</strong> {album.eventType}
            </p>
            <button
              className={styleAlbums.viewButton}
              onClick={() => navigate(`/album/${album._id}`)}
            >
              View Album
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedAlbums;
