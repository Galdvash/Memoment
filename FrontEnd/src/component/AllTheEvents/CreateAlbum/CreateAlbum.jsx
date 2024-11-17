// src/components/AllTheEvents/CreateAlbum/CreateAlbum.jsx
import React, { useEffect } from "react";
import styles from "./CreateAlbum.module.css";
import Dashboard from "../../../Library/Dashboard";
import useCreateAlbum from "../../../hooks/CreateAlbumHook/useCreateAlbum";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

const CreateAlbum = () => {
  const {
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
  } = useCreateAlbum();

  useEffect(() => {
    localStorage.setItem("completedFormData", JSON.stringify(formData));
    localStorage.setItem("currentStep", currentStep);
  }, [formData, currentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            handleChange={handleChange} // העברת handleChange
            handleCoverImageChange={handleCoverImageChange} // העברת handleFileChange
          />
        );
      case 2:
        return <Step2 formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            handleCreateAlbum={handleSubmit} // שימוש ב-handleSubmit
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
        <h4 className={styles.header}>Connect The Dots</h4>
        <div className={styles.progressContainer}>
          <ul className={styles.progressList}>
            {steps.map((stepItem, index) => (
              <li
                key={index}
                className={`${styles.progressItem} ${
                  index + 1 === currentStep ||
                  completedSteps.includes(index + 1)
                    ? styles.completed
                    : ""
                }`}
              >
                {stepItem}
              </li>
            ))}
          </ul>
          <div
            className={styles.progressBar}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        <div>{renderStepContent()}</div>
        <div className={styles.buttonContainer}>
          {currentStep < 3 && (
            <div
              className={styles.button}
              onClick={handleStart}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                cursor: "pointer",
              }}
            >
              Next Step
            </div>
          )}
          {currentStep === 3 && (
            <div
              className={styles.button}
              onClick={handleSubmit}
              style={{
                backgroundColor: "#ff1f35",
                color: "white",
                cursor: "pointer",
              }}
            >
              Finish and Create Album
            </div>
          )}
          <div
            className={`${styles.button} ${styles.resetButton}`}
            onClick={handleReset}
            style={{
              backgroundColor: "#ccc",
              color: "black",
              cursor: "pointer",
            }}
          >
            Reset
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>} {/* הצגת שגיאה */}
      </div>
    </div>
  );
};

export default CreateAlbum;
