import React from "react";
import useSelfieUpload from "../../hooks/SelfieUpload/useSelfieUpload";
import MatchedImages from "./MatchedImages";
import Webcam from "react-webcam";

const SelfieUpload = ({ albumId }) => {
  // נוסיף albumId כ-prop
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

  return (
    <div style={{ paddingTop: "50px", textAlign: "center" }}>
      <h1>Upload Your Selfie</h1>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || uploadedSelfie !== null}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setIsCapturing(true)}
          disabled={isUploading || uploadedSelfie !== null}
        >
          {isCapturing ? "Cancel" : "Take Selfie"}
        </button>
      </div>

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

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || uploadedSelfie !== null}
        >
          {isUploading ? "Uploading..." : "Upload Selfie"}
        </button>
      </div>

      {message && <p>{message}</p>}

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

      {matchedImages.length > 0 && (
        <MatchedImages images={matchedImages} albumId={albumId} />
      )}
    </div>
  );
};

export default SelfieUpload;
