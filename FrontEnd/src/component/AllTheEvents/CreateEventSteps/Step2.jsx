// src/components/AllTheEvents/CreateEventSteps/Step2.jsx
import React from "react";

const Step2 = ({ handleImageFileChange, handleExcelFileChange }) => {
  return (
    <div>
      <h2>Step 2: Upload Album Images and Guest List</h2>

      <div>
        <h3>Upload Event Images</h3>
        <input type="file" multiple onChange={handleImageFileChange} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Upload Excel File (Guest List)</h3>
        <input
          type="file"
          accept=".xlsx, .csv"
          onChange={handleExcelFileChange}
        />
      </div>
    </div>
  );
};

export default Step2;
