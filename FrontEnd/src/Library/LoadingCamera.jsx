import React from "react";
import styles from "./LoadingCamera.module.css";

const LoadingCamera = () => {
  return (
    <div className={styles.cameraLoadingContainer}>
      <div className={styles.camera}>
        <div className={styles.lens}>
          <div className={styles.shutter}></div>
        </div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingCamera;
