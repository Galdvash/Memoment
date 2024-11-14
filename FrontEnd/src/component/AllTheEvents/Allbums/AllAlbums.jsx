// src/components/AllAlbums.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import { Link } from "react-router-dom";

const AllAlbums = () => {
  const apiUrl = useApiUrl();
  const { userInformation } = useContext(UserContext);
  const token = localStorage.getItem("token");
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
        console.log("Fetched albums:", response.data); // בדיקה
        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setError("Failed to load albums.");
      }
    };

    if (userInformation) {
      fetchAllAlbums();
    }
  }, [apiUrl, token, userInformation]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!albums.length) {
    return <div>No albums found.</div>;
  }

  return (
    <div>
      <h2>All Your Albums</h2>
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
              <img
                src={`data:${album.coverImage.contentType};base64,${album.coverImage.data}`}
                alt="Cover"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <p>No cover image</p>
            )}
            <Link to={`/your-album/${album._id}`}>
              <button style={{ marginTop: "10px" }}>View Album</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAlbums;
