import React, { useState } from "react";
import styles from "./CreateEvent.module.css";

const CreateEvent = () => {
  const [progressWidth, setProgressWidth] = useState(0);

  const handleStart = () => {
    if (progressWidth < 600) {
      setProgressWidth(progressWidth + 200);
    }
  };

  const handleReset = () => {
    setProgressWidth(0);
  };

  const steps = ["1", "2", "3", "Finished"];

  return (
    <div>
      <h4>Connect The Dots</h4>
      <div className={styles.progressContainer}>
        <ul>
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
        <div
          className={styles.progressBar}
          style={{ width: `${progressWidth}px` }}
        ></div>
      </div>

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
  );
};

export default CreateEvent;
