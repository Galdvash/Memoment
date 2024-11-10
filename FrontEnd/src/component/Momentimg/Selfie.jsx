// import React, { useState, useRef } from "react";
import axios from "axios";
import MatchedImages from "./MatchedImages"; // ודא שהנתיב נכון
import Webcam from "react-webcam";
import React, { useState, useRef } from "react";
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
  const [isCapturing, setIsCapturing] = useState(false);
  const webcamRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageData(URL.createObjectURL(file));
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
        `${process.env.REACT_APP_API_URL}/selfies/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(response.data.message);
      setUploadedSelfie(selectedFile.name);
      localStorage.setItem("uploadedSelfie", selectedFile.name);
      setMatchedImages([]);
      localStorage.removeItem("matchedImages");
    } catch (error) {
      console.error("Error uploading selfie:", error);
      setMessage("Error uploading selfie");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/selfies/${encodeURIComponent(
          uploadedSelfie
        )}`
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

  const handleFaceRecognition = async () => {
    if (!selectedFile) {
      setMessage("Please upload a selfie first.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("sourceImage", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/face/match-faces`,
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
      setIsUploading(false);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
          setImageData(URL.createObjectURL(file));
          setIsCapturing(false);
        });
    }
  };

  return (
    <div style={{ paddingTop: "50px", textAlign: "center" }}>
      <h1>Upload Your Selfie</h1>

      {/* כפתור להעלאת תמונה מהמחשב */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || uploadedSelfie !== null}
        />
      </div>

      {/* כפתור לצילום תמונה במכשירים ניידים */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setIsCapturing(true)}
          disabled={isUploading || uploadedSelfie !== null}
        >
          {isCapturing ? "Cancel" : "Take Selfie"}
        </button>
      </div>

      {/* הצגת מצלמה אם במצב צילום */}
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
            <button onClick={capture} disabled={isUploading}>
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

      {/* כפתור להעלאת התמונה */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || uploadedSelfie !== null}
        >
          {isUploading ? "Uploading..." : "Upload Selfie"}
        </button>
      </div>

      {message && <p>{message}</p>}

      {/* הצגת תמונת Selfie שהועלתה */}
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

      {/* כפתורים נוספים לאחר העלאה */}
      {uploadedSelfie && (
        <div style={{ marginTop: "20px" }}>
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

      {/* הצגת תמונות מתאימות */}
      {matchedImages.length > 0 && <MatchedImages images={matchedImages} />}
    </div>
  );
};

export default SelfieUpload;
