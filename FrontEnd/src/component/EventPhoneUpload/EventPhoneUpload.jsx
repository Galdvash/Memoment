import React, { useState } from "react";
import axios from "axios";

const EventPhoneUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to the server
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/excel/upload", // הנתיב שלך לצד השרת
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading phone list:", error);
      setMessage("Error uploading phone list.");
    }
  };

  // Send SMS with OTP to the numbers in the Excel file
  const handleSendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/send-sms" // הנתיב שלך לשליחת OTP
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP messages.");
    }
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <h1>Upload Phone List for Event</h1>
      <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Phone List</button>
      <br />
      <button onClick={handleSendOTP} disabled={!file}>
        Send SMS with OTP
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EventPhoneUpload;
