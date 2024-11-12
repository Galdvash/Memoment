import React, { useState, useEffect } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

const EventImageUpload = () => {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [message, setMessage] = useState("");
  const apiUrl = useApiUrl(); // ה-URL לפי הסביבה (Production או Development)

  const fetchAllImages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/images`, {
        withCredentials: true,
      });
      const imagePromises = response.data.map(async (image) => {
        const imgResponse = await axios.get(
          `${apiUrl}/api/images/${encodeURIComponent(image.filename)}`,
          { responseType: "blob", withCredentials: true }
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
  };

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.imageUrl));
    };
  }, [uploadedImages]);

  useEffect(() => {
    fetchAllImages();
  });

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
          },
          withCredentials: true,
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
