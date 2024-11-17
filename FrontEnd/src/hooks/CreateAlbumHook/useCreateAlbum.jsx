// src/hooks/CreateAlbumHook/useCreateAlbum.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApiUrl } from "../ApiUrl/ApiProvider";

const useCreateAlbum = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    date: "",
    eventType: "",
    isPrivate: false,
    coverImage: null, // לוודא שהשדה קיים
    images: [],
    excelFile: null,
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = useApiUrl();
  const token = localStorage.getItem("token");

  // משתנים נוספים לניהול התקדמות
  const [progressWidth, setProgressWidth] = useState(0);
  const [currentStep, setCurrentStep] = useState(
    Number(localStorage.getItem("currentStep")) || 1
  );
  const [completedSteps, setCompletedSteps] = useState([]);
  const steps = ["1", "2", "3"];

  const handleStart = () => {
    setCurrentStep((prevStep) => prevStep + 1);
    setCompletedSteps((prevSteps) => [...prevSteps, currentStep]);
  };

  const handleReset = () => {
    setProgressWidth(0);
    setCurrentStep(1);
    setCompletedSteps([]);
    setFormData({
      eventName: "",
      location: "",
      date: "",
      eventType: "",
      isPrivate: false,
      coverImage: null, // לוודא שהשדה קיים
      images: [],
      excelFile: null,
    });
    localStorage.removeItem("completedFormData");
    localStorage.removeItem("currentStep");
    setError(null);
  };

  useEffect(() => {
    setProgressWidth((currentStep / steps.length) * 100);
  }, [currentStep, steps.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      coverImage: file, // מעדכן את השדה coverImage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("eventName", formData.eventName);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("eventType", formData.eventType);
      formDataToSend.append("isPrivate", formData.isPrivate);

      if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage);
      }

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }

      if (formData.excelFile) {
        formDataToSend.append("guestListFile", formData.excelFile);
      }

      // הוסף לוג לפני שליחת הבקשה
      console.log("FormData to send:", {
        eventName: formData.eventName,
        location: formData.location,
        date: formData.date,
        eventType: formData.eventType,
        isPrivate: formData.isPrivate,
        albumImage: formData.albumImage,
        images: formData.images,
        excelFile: formData.excelFile,
        coverImage: formData.coverImage,
      });

      const response = await axios.post(
        `${apiUrl}/api/albums/finalize`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const albumId =
        response.data.albumId || response.data._id || response.data.id;
      if (albumId) {
        handleReset();
        navigate(`/all-albums`);
      } else {
        console.error("No albumId found in response.");
        setError("Failed to retrieve album ID from response.");
      }
    } catch (error) {
      console.error("Error creating album:", error.response || error);
      setError(
        error.response?.data?.message ||
          "Failed to create album. Please try again."
      );
    }
  };

  return {
    formData,
    error,
    progressWidth,
    currentStep,
    completedSteps,
    steps,
    handleStart,
    handleReset,
    handleChange,
    handleCoverImageChange,
    handleSubmit,
    setFormData,
  };
};

export default useCreateAlbum;
