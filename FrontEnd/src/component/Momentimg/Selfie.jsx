import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MatchedImages from "./MatchedImages"; // Ensure the correct path
import Webcam from "react-webcam";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (uploadedSelfie && !imageData) {
      // Load the uploaded image from the server
      const imageUrl = `http://localhost:5000/api/selfies/${uploadedSelfie}`;
      setImageData(imageUrl);
      localStorage.setItem("imageData", imageUrl);
    }
  }, [uploadedSelfie, imageData]);

  useEffect(() => {
    // Save matchedImages to localStorage
    if (matchedImages.length > 0) {
      localStorage.setItem("matchedImages", JSON.stringify(matchedImages));
    }
  }, [matchedImages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageData(URL.createObjectURL(file));
    setMatchedImages([]);
    localStorage.removeItem("matchedImages");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please upload a selfie.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/selfies/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // If cookies are needed
        }
      );

      setMessage(response.data.message);
      setUploadedSelfie(response.data.filename);
      const imageUrl = `http://localhost:5000/api/selfies/${response.data.filename}`;
      setImageData(imageUrl);
      localStorage.setItem("uploadedSelfie", response.data.filename);
      localStorage.setItem("imageData", imageUrl);
    } catch (error) {
      console.error("Error uploading selfie:", error);
      setMessage("Error uploading selfie");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFaceRecognition = async () => {
    if (!uploadedSelfie) {
      setMessage("Please upload a selfie first.");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    const formData = new FormData();
    formData.append("sourceImage", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/face/match-faces`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (
        response.data.matchedImages &&
        Array.isArray(response.data.matchedImages)
      ) {
        setMatchedImages(response.data.matchedImages);
        localStorage.setItem(
          "matchedImages",
          JSON.stringify(response.data.matchedImages)
        );
        setMessage("Face recognition completed successfully.");
      } else {
        setMatchedImages([]);
        setMessage("No matched images found.");
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
      setMessage("Error during face recognition");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/selfies/${encodeURIComponent(
          uploadedSelfie
        )}`,
        {
          withCredentials: true, // If cookies are needed
        }
      );

      localStorage.removeItem("uploadedSelfie");
      localStorage.removeItem("imageData");
      localStorage.removeItem("matchedImages");

      setUploadedSelfie(null);
      setImageData(null);
      setMatchedImages([]);
      setMessage("Selfie deleted successfully");
    } catch (error) {
      console.error("Error deleting selfie:", error);
      setMessage("Error deleting selfie");
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
          setImageData(URL.createObjectURL(file));
          setIsCapturing(false);
          setMatchedImages([]);
          localStorage.removeItem("matchedImages");
        });
    }
  };

  return (
    <div style={{ paddingTop: "50px", textAlign: "center" }}>
      <h1>Upload Your Selfie</h1>

      {/* File Upload */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || uploadedSelfie !== null}
        />
      </div>

      {/* Webcam Capture */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setIsCapturing(true)}
          disabled={isUploading || uploadedSelfie !== null}
        >
          {isCapturing ? "Cancel" : "Take Selfie"}
        </button>
      </div>

      {/* Webcam Interface */}
      {isCapturing && (
        <div style={{ marginTop: "20px" }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            height={300}
            videoConstraints={{
              facingMode: "user",
            }}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleCapture} disabled={isUploading}>
              Capture
            </button>
            <button
              onClick={() => setIsCapturing(false)}
              style={{ marginLeft: "10px" }}
              disabled={isUploading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || uploadedSelfie !== null}
        >
          {isUploading ? "Uploading..." : "Upload Selfie"}
        </button>
      </div>

      {/* Message Display */}
      {message && <p>{message}</p>}

      {/* Display Uploaded Selfie */}
      {imageData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Selfie</h2>
          <img
            src={imageData}
            alt={`Uploaded selfie: ${uploadedSelfie}`}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
      )}

      {/* Face Recognition and Delete Buttons */}
      {uploadedSelfie && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleFaceRecognition} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Start Face Recognition"}
          </button>
          <button
            onClick={handleDelete}
            style={{ marginLeft: "10px" }}
            disabled={isProcessing}
          >
            Delete Selfie
          </button>
        </div>
      )}

      {/* Display Matched Images */}
      {matchedImages.length > 0 && <MatchedImages images={matchedImages} />}
    </div>
  );
};

export default SelfieUpload;
