import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useApiUrl } from "../../../hooks/ApiUrl/ApiProvider";
import { UserContext } from "../../../hooks/UserHooks/userContextApp";
import styleAlbum from "./AlbumView.module.css";
import { useNavigate } from "react-router-dom";

const AlbumView = () => {
  const { albumId } = useParams();
  const apiUrl = useApiUrl();
  const { userInformation } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlbum(response.data);
      } catch (error) {
        console.error("Error fetching album:", error.response || error);
        setError(
          error.response?.data?.message ||
            "Failed to load album. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userInformation) {
      fetchAlbum();
    }
  }, [apiUrl, userInformation, token, albumId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styleAlbum.error}>{error}</div>;
  }

  if (!album) {
    return (
      <div className={styleAlbum.noAlbum}>
        <p>Album not found.</p>
      </div>
    );
  }

  return (
    <div className={styleAlbum.container}>
      <h2 className={styleAlbum.heading}>{album.eventName}</h2>
      <div className={styleAlbum.imagesGrid}>
        <button className={styleAlbum.backButton} onClick={() => navigate(-1)}>
          Back to Albums
        </button>
        {album.images && album.images.length > 0 ? (
          album.images.map((image, index) => (
            <div key={index} className={styleAlbum.imageCard}>
              <img
                src={`data:${image.contentType};base64,${image.data}`}
                alt={image.filename}
                className={styleAlbum.albumImage}
              />
            </div>
          ))
        ) : (
          <p>No images in this album.</p>
        )}
      </div>
    </div>
  );
};

export default AlbumView;
