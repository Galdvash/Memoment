// src/components/AllTheEvents/Allbums/AllAlbums.jsx
import React, { useEffect, useState, useContext } from "react";
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

  useEffect(() => {
    const fetchAllAlbums = async () => {
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
    };

    if (userInformation && !loading) {
      fetchAllAlbums();
    }
  }, [apiUrl, token, userInformation, loading]);

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
              <strong>Privacy:</strong> {album.isPrivate ? "Private" : "Public"}
            </p>
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
            <button onClick={() => navigate(`/your-album/${album._id}`)}>
              View Album
            </button>
            <button
              onClick={() => navigate(`/selfie/${album._id}`)}
              style={{ marginTop: "10px" }}
            >
              Face Recognition
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAlbums;
