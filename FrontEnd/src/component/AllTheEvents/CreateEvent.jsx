import React, { useState } from "react";
import styles from "./CreateEvent.module.css";
import Dashboard from "../../Library/Dashboard"; // ייבוא הקומפוננטה

const CreateEvent = () => {
  const [progressWidth, setProgressWidth] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

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
  };

  const steps = ["1", "2", "3"];

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Step 1: Create Event</h2>
            <p>Enter the name and date of your event.</p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Event Details</h2>
            <p>Add location and description.</p>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Review and Confirm</h2>
            <p>Review your event details and confirm.</p>
          </div>
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
            {steps.map((step, index) => (
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
                {step}
              </li>
            ))}
          </ul>
          <div
            className={styles.progressBar}
            style={{ width: `${progressWidth}px` }}
          ></div>
        </div>

        <div>{renderStepContent(currentStep)}</div>

        <div className={styles.button} onClick={handleStart}>
          Connect
        </div>
        <div
          className={`${styles.button} ${styles.resetButton}`}
          onClick={handleReset}
        >
          Reset
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
