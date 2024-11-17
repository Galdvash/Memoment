import { useState, useContext, useRef } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";
import { UserContext } from "../../hooks/UserHooks/userContextApp";

const useSelfieUpload = (albumId) => {
  const apiUrl = useApiUrl();
  const { userInformation } = useContext(UserContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedSelfie, setUploadedSelfie] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [matchedImages, setMatchedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const webcamRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageData(URL.createObjectURL(file));
    setMatchedImages([]);
  };

  // Upload selfie
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please upload a selfie.");
      return;
    }

    if (!albumId || !userInformation) {
      setMessage("Missing albumId or user information.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("sourceImage", selectedFile);
    formData.append("albumId", albumId);
    formData.append("userId", userInformation._id);

    try {
      const response = await axios.post(
        `${apiUrl}/api/selfies/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
      setUploadedSelfie(response.data.filename);
      setImageData(`${apiUrl}/api/selfies/${response.data.filename}`);
    } catch (error) {
      console.error("Error uploading selfie:", error);
      setMessage(error.response?.data || "Error uploading selfie.");
    } finally {
      setIsUploading(false);
    }
  };

  // Face recognition
  const handleFaceRecognition = async () => {
    if (!uploadedSelfie) {
      setMessage("Please upload a selfie first.");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    const formData = new FormData();
    formData.append("albumId", albumId);
    formData.append("userId", userInformation._id);
    formData.append("sourceImage", selectedFile); // השתמש ב-selectedFile ולא ב-uploadedSelfie

    try {
      const response = await axios.post(
        `${apiUrl}/api/selfies/match-faces`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.matchedImages?.length > 0) {
        setMatchedImages(response.data.matchedImages);
        setMessage("Face recognition completed successfully.");
      } else {
        setMessage("No matches found.");
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
      setMessage(
        error.response?.data?.message || "Error during face recognition."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete selfie
  const handleDelete = async () => {
    if (!uploadedSelfie) {
      setMessage("No selfie to delete.");
      return;
    }

    try {
      await axios.delete(
        `${apiUrl}/api/selfies/${encodeURIComponent(uploadedSelfie)}`
      );
      setUploadedSelfie(null);
      setImageData(null);
      setMatchedImages([]);
      setMessage("Selfie deleted successfully");
    } catch (error) {
      console.error("Error deleting selfie:", error);
      setMessage("Error deleting selfie");
    }
  };

  // Capture selfie using webcam
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
        });
    }
  };

  return {
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
  };
};

export default useSelfieUpload;
