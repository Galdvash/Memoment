// src/components/AllTheEvents/CreateEvent.jsx
import React, { useState, useEffect } from "react";
import styles from "./CreateEvent.module.css";
import Dashboard from "../../Library/Dashboard";
import useCreateEvent from "../../hooks/CreateEventHook/useCreateEvent";
import Step1 from "./CreateEventSteps/Step1";
import Step2 from "./CreateEventSteps/Step2";
import Step3 from "./CreateEventSteps/Step3";
import axios from "axios";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";
import { useNavigate } from "react-router-dom"; // הוסף את הייבוא

const CreateEvent = () => {
  const {
    progressWidth,
    currentStep,
    completedSteps,
    formData,
    steps,
    handleStart,
    handleReset,
    handleChange,
    handleFileChange,
    setFormData,
  } = useCreateEvent();
  const navigate = useNavigate();
  const apiUrl = useApiUrl();
  const token = localStorage.getItem("token");
  const [completedFormData, setCompletedFormData] = useState(
    JSON.parse(localStorage.getItem("completedFormData")) || formData
  );

  const canProceed =
    currentStep === 3 ? completedFormData.isPrivate !== undefined : true;

  useEffect(() => {
    localStorage.setItem(
      "completedFormData",
      JSON.stringify(completedFormData)
    );
    localStorage.setItem("currentStep", currentStep);
  }, [completedFormData, currentStep]);

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      handleStart();
    }
  };
  // src/components/AllTheEvents/CreateEvent.jsx
  const handleCreateAlbum = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("eventName", completedFormData.eventName);
      formDataToSend.append("location", completedFormData.location);
      formDataToSend.append("date", completedFormData.date);
      formDataToSend.append("eventType", completedFormData.eventType);
      formDataToSend.append("isPrivate", completedFormData.isPrivate);

      if (completedFormData.albumImage) {
        formDataToSend.append("coverImage", completedFormData.albumImage);
      }

      if (completedFormData.images && completedFormData.images.length > 0) {
        completedFormData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }

      if (completedFormData.excelFile) {
        formDataToSend.append("guestListFile", completedFormData.excelFile);
      }

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

      console.log("Response data:", response.data); // הוסף זאת לבדיקה

      // בדיקה של שדה ה-albumId
      const albumId =
        response.data.albumId || response.data._id || response.data.id;
      if (albumId) {
        console.log("Album created successfully with ID:", albumId);
        handleReset();
        navigate(`/all-albums`);
      } else {
        console.error("No albumId found in response.");
      }
    } catch (error) {
      console.error("Error creating album:", error);
      // טיפול בשגיאות
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={completedFormData}
            handleChange={(e) => {
              handleChange(e);
              setCompletedFormData({
                ...completedFormData,
                [e.target.name]: e.target.value,
              });
              console.log("Updated form data (Step1):", {
                ...completedFormData,
                [e.target.name]: e.target.value,
              });
            }}
            handleFileChange={(e) => {
              handleFileChange(e);
              setCompletedFormData({
                ...completedFormData,
                albumImage: e.target.files[0],
              });
              console.log("Updated form data (Step1 - albumImage):", {
                ...completedFormData,
                albumImage: e.target.files[0],
              });
            }}
          />
        );
      case 2:
        return (
          <Step2
            handleImageFileChange={(e) => {
              const files = Array.from(e.target.files);
              setCompletedFormData({
                ...completedFormData,
                images: files,
              });
              console.log("Updated form data (Step2 - images):", {
                ...completedFormData,
                images: files,
              });
            }}
            handleExcelFileChange={(e) => {
              const excelFile = e.target.files[0];
              setCompletedFormData({
                ...completedFormData,
                excelFile: excelFile,
              });
              console.log("Updated form data (Step2 - excelFile):", {
                ...completedFormData,
                excelFile: excelFile,
              });
            }}
          />
        );
      case 3:
        return (
          <Step3
            formData={completedFormData}
            setFormData={setFormData}
            handleCreateAlbum={handleCreateAlbum}
          />
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className={styles.wrapper}>
      <Dashboard />
      <div className={styles.container}>
        <h4>Connect The Dots</h4>
        <div className={styles.progressContainer}>
          <ul>
            {steps.map((stepItem, index) => (
              <li
                key={index}
                style={{
                  backgroundColor:
                    index + 1 === currentStep ||
                    completedSteps.includes(index + 1)
                      ? "#ff1f35"
                      : "#fff",
                  color:
                    index + 1 === currentStep ||
                    completedSteps.includes(index + 1)
                      ? "#fff"
                      : "#000",
                  border:
                    index + 1 > currentStep &&
                    !completedSteps.includes(index + 1)
                      ? "2px solid #ff1f35"
                      : "none",
                }}
              >
                {stepItem}
              </li>
            ))}
          </ul>
          <div
            className={styles.progressBar}
            style={{ width: `${progressWidth}px` }}
          ></div>
        </div>

        <div>{renderStepContent()}</div>

        <div className={styles.buttonContainer}>
          {currentStep < 3 && (
            <div
              className={styles.button}
              onClick={canProceed ? handleNextStep : undefined}
              style={{
                backgroundColor: canProceed ? "#4CAF50" : "gray",
                color: canProceed ? "white" : "darkgray",
                cursor: canProceed ? "pointer" : "not-allowed",
              }}
            >
              Next Step
            </div>
          )}
          {currentStep === 3 && (
            <div
              className={styles.button}
              onClick={canProceed ? handleCreateAlbum : undefined}
              style={{
                backgroundColor: canProceed ? "#ff1f35" : "gray", // אדום כאשר canProceed הוא true
                color: "white",
                cursor: canProceed ? "pointer" : "not-allowed",
              }}
            >
              Finish and Create Album
            </div>
          )}

          <div
            className={`${styles.button} ${styles.resetButton}`}
            onClick={handleReset}
          >
            Reset
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
