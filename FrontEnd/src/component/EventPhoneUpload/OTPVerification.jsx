import React, { useState } from "react";
import axios from "axios";

const OTPVerification = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Send OTP to all numbers in the file
  const handleSendMessages = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/upload-phone-list", // נתיב להעלאת קובץ ושליחת הודעות
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message); // הודעה מוצגת אחרי שליחה מוצלחת
    } catch (error) {
      console.error("Error sending messages:", error);
      setMessage("Error sending messages.");
    }
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <h1>Send OTP to All Phone Numbers</h1>
      <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} />
      <button onClick={handleSendMessages}>Send Messages</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OTPVerification;
