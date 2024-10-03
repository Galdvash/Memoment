import React, { useState, useEffect } from "react";
import axios from "axios";
import MatchedImages from "./MatchedImages"; // ודא שהנתיב נכון

const SelfieUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedSelfie, setUploadedSelfie] = useState(
    localStorage.getItem("uploadedSelfie") || null
  );
  const [imageData, setImageData] = useState(
    localStorage.getItem("imageData") || null
  );
  const [matchedImages, setMatchedImages] = useState(
    JSON.parse(localStorage.getItem("matchedImages")) || []
  );
  const [isUploading, setIsUploading] = useState(false); // מצב העלאה

  // Fetch selfie image after upload
  useEffect(() => {
    if (uploadedSelfie && !imageData) {
      const fetchSelfie = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/selfies/${encodeURIComponent(
              uploadedSelfie
            )}`,
            { responseType: "blob" }
          );
          const imageUrl = URL.createObjectURL(response.data);
          setImageData(imageUrl);
          localStorage.setItem("imageData", imageUrl);
        } catch (error) {
          console.error("Error fetching selfie:", error);
          setMessage("Error fetching selfie");
        }
      };

      fetchSelfie();
    }
  }, [uploadedSelfie, imageData]);

  // Initialize matchedImages from localStorage
  useEffect(() => {
    const storedMatchedImages = JSON.parse(
      localStorage.getItem("matchedImages")
    );
    if (storedMatchedImages) {
      setMatchedImages(storedMatchedImages);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Set the selected file correctly
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please upload a selfie.");
      return;
    }

    setIsUploading(true); // מתחיל העלאה
    console.log("Uploading started"); // לוג לבדיקה

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/selfies/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(response.data.message);
      setUploadedSelfie(selectedFile.name);
      localStorage.setItem("uploadedSelfie", selectedFile.name);
      // נקה את matchedImages בעת העלאה חדשה
      setMatchedImages([]);
      localStorage.removeItem("matchedImages");
    } catch (error) {
      console.error("Error uploading selfie:", error);
      setMessage("Error uploading selfie");
    } finally {
      setIsUploading(false); // מסיים העלאה
      console.log("Uploading finished"); // לוג לבדיקה
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/selfies/${encodeURIComponent(
          uploadedSelfie
        )}`
      );

      // Clear local storage
      localStorage.removeItem("uploadedSelfie");
      localStorage.removeItem("imageData");
      localStorage.removeItem("matchedImages");

      // Clear state
      setUploadedSelfie(null);
      setImageData(null);
      setMatchedImages([]);
      setMessage("Selfie deleted successfully");
    } catch (error) {
      console.error("Error deleting selfie:", error);
      setMessage("Error deleting selfie");
    }
  };

  const handleFaceRecognition = async () => {
    if (!selectedFile) {
      setMessage("Please upload a selfie first.");
      return;
    }

    setIsUploading(true); // מתחיל תהליך זיהוי פנים
    console.log("Face recognition started"); // לוג לבדיקה

    try {
      const formData = new FormData();
      formData.append("sourceImage", selectedFile); // Ensure the correct image file is sent

      // Send the image to the backend for face recognition
      const response = await axios.post(
        "http://localhost:5000/match-faces",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMatchedImages(response.data.matchedImages);
      localStorage.setItem(
        "matchedImages",
        JSON.stringify(response.data.matchedImages)
      );
      setMessage("Face recognition completed successfully.");
    } catch (error) {
      console.error("Error during face recognition:", error);
      setMessage("Error during face recognition");
    } finally {
      setIsUploading(false); // מסיים תהליך זיהוי פנים
      console.log("Face recognition finished"); // לוג לבדיקה
    }
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <h1>Upload Your Selfie</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || uploadedSelfie !== null} // השבתה אם במצב העלאה או כבר הועלתה תמונה
        />
        <button type="submit" disabled={isUploading || uploadedSelfie !== null}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p>{message}</p>}

      {imageData && (
        <div>
          <h2>Uploaded Selfie</h2>
          <img
            src={imageData}
            alt={`Uploaded selfie: ${uploadedSelfie}`}
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>
      )}

      {uploadedSelfie && (
        <div>
          <button onClick={handleFaceRecognition} disabled={isUploading}>
            {isUploading ? "Processing..." : "Start Face Recognition"}
          </button>
          <button
            onClick={handleDelete}
            style={{ marginLeft: "10px" }}
            disabled={isUploading}
          >
            Delete Selfie
          </button>
        </div>
      )}

      {matchedImages.length > 0 && <MatchedImages images={matchedImages} />}
    </div>
  );
};

export default SelfieUpload;
