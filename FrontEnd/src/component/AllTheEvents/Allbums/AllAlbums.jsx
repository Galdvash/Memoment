import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import { useNavigate } from "react-router-dom";
import styleAlbums from "./AllAlbums.module.css";
import LoadingCamera from "../../../Library/LoadingCamera";
const AllAlbums = () => {
  const apiUrl = useApiUrl();
  const { userInformation, loading } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [email, setEmail] = useState("");
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
  const handleShareAlbum = async () => {
    if (!email) {
      alert("Please enter an email.");
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/api/albums/${selectedAlbum}/share`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Album shared successfully.");
      setShowModal(false);
      setEmail("");
    } catch (error) {
      console.error("Error sharing album:", error.response || error);
      alert("Failed to share album. Please try again.");
    }
  };

  if (loading) {
    return <LoadingCamera />; // שימוש בקומפוננטת טעינה
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styleAlbums.container}>
      <h2 className={styleAlbums.heading}>All Your Albums</h2>
      <button className={styleAlbums.createButton} onClick={handleCreateAlbum}>
        Create New Album
      </button>
      <div className={styleAlbums.albumsGrid}>
        {albums.map((album) => (
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
            <p className={styleAlbums.albumDetails}>
              <strong>Guests:</strong> {album.numberOfGuests || 0}
            </p>
            <p className={styleAlbums.albumDetails}>
              <strong>Views:</strong> {album.views || 0}
            </p>
            <button
              className={styleAlbums.viewButton}
              onClick={() => handleViewAlbum(album._id)}
            >
              View Album
            </button>
            <button
              className={styleAlbums.deleteButton}
              onClick={() => handleDeleteAlbum(album._id)}
            >
              Delete Album
            </button>
            <button
              className={styleAlbums.selfieButton}
              onClick={() => navigate(`/selfie/${album._id}`)}
            >
              Face Recognition
            </button>
            <button
              className={styleAlbums.shareButton}
              onClick={() => {
                setSelectedAlbum(album._id);
                setShowModal(true);
              }}
            >
              Share Album
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styleAlbums.modalOverlay}>
          <div className={styleAlbums.modalContent}>
            <h3>Share Album</h3>
            <p>To share this album, enter the user's email:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User's email"
              className={styleAlbums.emailInput}
            />
            <button
              onClick={handleShareAlbum}
              className={styleAlbums.shareConfirmButton}
            >
              Share
            </button>
            <button
              onClick={() => setShowModal(false)}
              className={styleAlbums.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAlbums;
