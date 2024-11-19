import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import { useNavigate } from "react-router-dom";

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

  const handleViewAlbum = async (albumId) => {
    const viewedAlbums = JSON.parse(localStorage.getItem("viewedAlbums")) || [];

    if (!viewedAlbums.includes(albumId)) {
      // הוסף את מזהה האלבום לרשימה המקומית
      localStorage.setItem(
        "viewedAlbums",
        JSON.stringify([...viewedAlbums, albumId])
      );

      // שלח בקשה לשרת לצפייה באלבום
      try {
        await axios.get(`${apiUrl}/api/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error viewing album:", error.response || error);
      }
    }

    // הפנה את המשתמש לעמוד האלבום
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

  if (!albums.length) {
    return (
      <div>
        <h2>No albums found</h2>
        <button onClick={() => navigate("/CreateAlbum")}>
          Create New Album
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>All Your Albums</h2>
      <button
        onClick={() => navigate("/CreateAlbum")}
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Create New Album
      </button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {albums.map((album) => (
          <div
            key={album._id}
            style={{
              margin: "10px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              textAlign: "center",
            }}
          >
            {album.coverImage && album.coverImage.data ? (
              <div>
                <img
                  src={`data:${album.coverImage.contentType};base64,${album.coverImage.data}`}
                  alt="Cover"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <p>No cover image available</p>
            )}
            <h3>{album.eventName}</h3>
            <p>
              <strong>Location:</strong> {album.location}
            </p>
            <p>
              <strong>Date:</strong> {new Date(album.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Type:</strong> {album.eventType}
            </p>
            <p>
              <strong>Guests:</strong> {album.numberOfGuests || 0}
            </p>
            <p>
              <strong>Views:</strong> {album.views || 0}
            </p>
            <p>
              <strong>Privacy:</strong> {album.isPrivate ? "Private" : "Public"}
            </p>
            <button onClick={() => handleViewAlbum(album._id)}>
              View Album
            </button>
            <button
              onClick={() => navigate(`/selfie/${album._id}`)}
              style={{ marginTop: "10px" }}
            >
              Face Recognition
            </button>
            <button
              onClick={() => handleDeleteAlbum(album._id)}
              style={{
                marginTop: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: "5px 10px",
              }}
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
