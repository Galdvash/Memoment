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

  const [error, setError] = useState([]);
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
    const isStepValid = () => {
      switch (currentStep) {
        case 1:
          // בדוק רק שדות חובה בשלב 1
          return formData.eventName && formData.location && formData.date;
        case 2:
          // בדוק אם העלו תמונות או קובץ אקסל (לא שניהם חובה)
          return formData.images.length > 0 || formData.excelFile;
        case 3:
          // בדוק אם checkbox של פרטיות מסומן
          return formData.isPrivate === true;
        default:
          return true;
      }
    };

    if (!isStepValid()) {
      setError(`Please complete all required fields for step ${currentStep}.`);
      return;
    }

    // אם כל השדות הנדרשים מלאים, המשך לשלב הבא
    if (currentStep < steps.length) {
      setCompletedSteps((prev) =>
        [...new Set([...prev, currentStep])].sort((a, b) => a - b)
      );
      setCurrentStep((prevStep) => prevStep + 1);
      setError(null); // נקה שגיאות במעבר מוצלח
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

      // שדות טקסטואליים
      formDataToSend.append("eventName", formData.eventName);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("eventType", formData.eventType);
      formDataToSend.append("isPrivate", formData.isPrivate);

      // קובץ coverImage (אינו חובה)
      if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage);
      }

      // קובץ guestListFile
      if (formData.excelFile) {
        formDataToSend.append("guestListFile", formData.excelFile);
      }

      // קבצים images
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }

      // בקשת POST לשרת
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

      // הצלחה
      if (response.data?.albumId) {
        handleReset();
        navigate("/all-albums");
      }
    } catch (error) {
      console.error("Error submitting album:", error);
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
