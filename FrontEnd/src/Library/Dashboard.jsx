import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import Vector from "../images/Vector (1).svg";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${styles.dashboard} ${isOpen ? styles.open : styles.closed}`}
    >
      <button
        className={`${styles.menuButton} ${!isOpen ? styles.rotate : ""}`}
        onClick={toggleDashboard}
      >
        <img src={Vector} alt="vector" />
      </button>
      {isOpen && <div className={styles.content}>Dashboard Content</div>}
    </div>
  );
};

export default Dashboard;
