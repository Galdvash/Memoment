import React from "react";
import styles from "./CreateAlbum.module.css";
import useCreateAlbum from "../../../hooks/CreateAlbumHook/useCreateAlbum";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

const CreateAlbum = () => {
  const {
    formData,
    setFormData,
    currentStep,
    completedSteps,
    progressWidth,
    steps,
    handleStart,
    handleReset,
    handleChange,
    handleCoverImageChange,
    handleSubmit,
    error,
  } = useCreateAlbum();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            handleChange={handleChange}
            handleCoverImageChange={handleCoverImageChange}
          />
        );
      case 2:
        return <Step2 formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3 formData={formData} handleCreateAlbum={handleSubmit} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h4 className={styles.header}>Create New Album</h4>
        <div className={styles.progressContainer}>
          <ul className={styles.progressList}>
            {steps.map((step, index) => (
              <li
                key={index}
                className={`${styles.progressItem} ${
                  completedSteps.includes(index + 1) ? styles.completed : ""
                } ${currentStep === index + 1 ? styles.red : ""}`}
              >
                {step}
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
          {currentStep < steps.length && (
            <button className={styles.button} onClick={handleStart}>
              Next Step
            </button>
          )}
          {currentStep === steps.length && (
            <button className={styles.button} onClick={handleSubmit}>
              Finish and Create Album
            </button>
          )}
          <button className={styles.resetButton} onClick={handleReset}>
            Reset
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default CreateAlbum;
