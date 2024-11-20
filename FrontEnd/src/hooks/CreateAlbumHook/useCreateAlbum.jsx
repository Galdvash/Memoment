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
    coverImage: null,
    images: [],
    excelFile: null,
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = useApiUrl();
  const token = localStorage.getItem("token");

  const [progressWidth, setProgressWidth] = useState(0);
  const [currentStep, setCurrentStep] = useState(
    Number(localStorage.getItem("currentStep")) || 1
  );
  const [completedSteps, setCompletedSteps] = useState(
    JSON.parse(localStorage.getItem("completedSteps")) || []
  );
  const steps = ["1", "2", "3"];

  // עדכון רוחב פס ההתקדמות
  useEffect(() => {
    const width = ((currentStep - 1) / (steps.length - 1)) * 100;
    setProgressWidth(width.toFixed(2));
  }, [currentStep, steps.length]);

  // שמירת מצב השלבים ב-Local Storage
  useEffect(() => {
    localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
    localStorage.setItem("currentStep", currentStep);
  }, [completedSteps, currentStep]);

  const handleStart = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) =>
        [...new Set([...prev, currentStep])].sort((a, b) => a - b)
      );
      setCurrentStep((prevStep) => prevStep + 1);
    }
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
      coverImage: null,
      images: [],
      excelFile: null,
    });
    localStorage.removeItem("currentStep");
    localStorage.removeItem("completedSteps");
    localStorage.removeItem("completedFormData");
    setError(null);
  };

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
      coverImage: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((image) => formDataToSend.append("images", image));
        } else {
          formDataToSend.append(key, value);
        }
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

      if (response.data?.albumId) {
        handleReset();
        navigate("/all-albums");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create album.");
    }
  };

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    progressWidth,
    steps,
    handleStart,
    handleReset,
    handleChange,
    handleCoverImageChange,
    handleSubmit,
    error,
  };
};

export default useCreateAlbum;
