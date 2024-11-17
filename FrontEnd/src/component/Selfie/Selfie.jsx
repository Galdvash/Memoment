import React, { useEffect } from "react";
import useSelfieUpload from "../../hooks/SelfieUpload/useSelfieUpload";
import MatchedImages from "../Selfie/MatchedImages";
import Webcam from "react-webcam";
import { useParams } from "react-router-dom";

const SelfieUpload = () => {
  const { albumId } = useParams();
  const {
    selectedFile,
    message,
    uploadedSelfie,
    imageData,
    matchedImages,
    isUploading,
    isProcessing,
    isCapturing,
    setIsCapturing,
    webcamRef,
    handleFileChange,
    handleUpload,
    handleFaceRecognition,
    handleDelete,
    handleCapture,
  } = useSelfieUpload(albumId);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem("selectedFile", selectedFile ? selectedFile.name : "");
    localStorage.setItem("uploadedSelfie", uploadedSelfie || "");
    localStorage.setItem("imageData", imageData || "");
    localStorage.setItem(
      "matchedImages",
      JSON.stringify(matchedImages) || "[]"
    );
  }, [selectedFile, uploadedSelfie, imageData, matchedImages]);

  return (
    <div style={{ paddingTop: "50px", textAlign: "center" }}>
      <h1>Upload Your Selfie</h1>

      {/* Input for selecting file */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || uploadedSelfie !== null}
        />
      </div>

      {/* Button for taking selfie with Webcam */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setIsCapturing(true)}
          disabled={isUploading || uploadedSelfie !== null}
        >
          {isCapturing ? "Cancel" : "Take Selfie"}
        </button>
      </div>

      {/* Webcam for taking selfie */}
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

      {/* Button for uploading selfie */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || uploadedSelfie !== null}
        >
          {isUploading ? "Uploading..." : "Upload Selfie"}
        </button>
      </div>

      {/* Displaying message */}
      {message && <p>{message}</p>}

      {/* Display uploaded selfie */}
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

      {/* Display matched images */}
      {matchedImages.length > 0 && (
        <MatchedImages matchedImages={matchedImages} albumId={albumId} />
      )}
    </div>
  );
};

export default SelfieUpload;
