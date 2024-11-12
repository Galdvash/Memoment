import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

const useSelfieUpload = () => {
  const apiUrl = useApiUrl();
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
      const imageUrl = `${apiUrl}/api/selfies/${uploadedSelfie}`;
      setImageData(imageUrl);
      localStorage.setItem("imageData", imageUrl);
    }
  }, [uploadedSelfie, imageData, apiUrl]);

  useEffect(() => {
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
        `${apiUrl}/api/selfies/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
      setUploadedSelfie(response.data.filename);
      const imageUrl = `${apiUrl}/api/selfies/${response.data.filename}`;
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
        `${apiUrl}/api/face/match-faces`,
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
        `${apiUrl}/api/selfies/${encodeURIComponent(uploadedSelfie)}`,
        {
          withCredentials: true,
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
