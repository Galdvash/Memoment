// hooks/useCreateEvent.jsx
import { useState } from "react";

const useCreateEvent = () => {
  const [progressWidth, setProgressWidth] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    date: "",
    eventType: "",
    albumImage: null,
    isPrivate: undefined, // נוסיף ברירת מחדל לשדה הפרטיות
  });

  const steps = ["1", "2", "3"];

  const handleStart = () => {
    if (currentStep < steps.length) {
      setProgressWidth(progressWidth + 250);
      setTimeout(() => {
        setCompletedSteps((prevSteps) => [...prevSteps, currentStep]);
        setCurrentStep((prevStep) => prevStep + 1);
      }, 1000);
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
      albumImage: null,
      isPrivate: undefined, // איפוס השדה לפרטיות
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      albumImage: e.target.files[0],
    }));
  };

  const handleFileUpload = (fileType) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = fileType === "coverImage" ? "image/*" : ".xlsx,.csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      console.log(`Selected file for ${fileType}:`, file);
    };
    input.click();
  };

  return {
    progressWidth,
    currentStep,
    completedSteps,
    formData,
    steps,
    handleStart,
    handleReset,
    handleChange,
    handleFileChange,
    handleFileUpload,
    setFormData, // החזרת setFormData כדי לעדכן את formData מקומפוננטות אחרות
  };
};

export default useCreateEvent;
