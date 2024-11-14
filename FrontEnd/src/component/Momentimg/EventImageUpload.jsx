// components/EventImageUpload.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

const EventImageUpload = ({ albumId }) => {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [message, setMessage] = useState("");
  const apiUrl = useApiUrl();

  const fetchAllImages = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/images`, {
        params: { albumId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const imagePromises = response.data.map(async (image) => {
        const imgResponse = await axios.get(
          `${apiUrl}/api/images/${encodeURIComponent(image.filename)}`,
          {
            params: { albumId },
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const imageUrl = URL.createObjectURL(imgResponse.data);
        return { filename: image.filename, imageUrl };
      });
      const imagesWithUrls = await Promise.all(imagePromises);
      setUploadedImages(imagesWithUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage("Error fetching images.");
    }
  }, [apiUrl, albumId]);

  useEffect(() => {
    fetchAllImages();
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.imageUrl));
    };
  }, [fetchAllImages, uploadedImages]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setMessage("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("albumId", albumId);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        `${apiUrl}/api/images/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data.message);
      fetchAllImages();
    } catch (error) {
      console.error("Error uploading images:", error);
      setMessage("Error uploading images.");
    }
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <h1>Upload Event Images</h1>
      <form onSubmit={handleUpload}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload Images</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Uploaded Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {uploadedImages.map((image, index) => (
          <div key={index} style={{ margin: "10px" }}>
            <img
              src={image.imageUrl}
              alt={`Uploaded image: ${image.filename}`}
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <p>{image.filename}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventImageUpload;
