import React from "react";

const Step2 = ({ formData, setFormData }) => {
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files, // שמירת תמונות ב-formData
    }));
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      excelFile: file, // שמירת קובץ אקסל ב-formData
    }));
  };

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
