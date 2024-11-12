import React, { useState, useEffect } from "react";
import axios from "axios";

const EventImageUpload = () => {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [message, setMessage] = useState("");

  // Function to fetch all images from the server
  const fetchAllImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/images", {
        withCredentials: true, // Send cookies for authentication
      });
      const imagePromises = response.data.map(async (image) => {
        // Fetch the binary image data for each filename
        const imgResponse = await axios.get(
          `http://localhost:5000/api/images/${encodeURIComponent(
            image.filename
          )}`,
          { responseType: "blob", withCredentials: true } // Fetch the image as blob (binary) with credentials
        );
        // Create a local URL for each image
        const imageUrl = URL.createObjectURL(imgResponse.data);
        return { filename: image.filename, imageUrl };
      });
      const imagesWithUrls = await Promise.all(imagePromises);
      setUploadedImages(imagesWithUrls); // Store the images with URLs
    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage("Error fetching images.");
    }
  };

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.imageUrl));
    };
  }, [uploadedImages]);

  // Fetch all images when the component mounts
  useEffect(() => {
    fetchAllImages();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert to an array
    setImages(files); // Set selected images
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
        "http://localhost:5000/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Send cookies for authentication
        }
      );
      setMessage(response.data.message);

      // Fetch images again to refresh the list after upload
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
        <input
          type="file"
          multiple // Allow selecting multiple images
          onChange={handleFileChange}
        />
        <button type="submit">Upload Images</button>
      </form>
      {message && <p>{message}</p>}

      {/* Display uploaded images */}
      <h2>Uploaded Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {uploadedImages.map((image, index) => (
          <div key={index} style={{ margin: "10px" }}>
            <img
              src={image.imageUrl} // Use the image URL stored from blob
              alt={image.filename ? `Uploaded image: ${image.filename}` : ""}
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
