import React, { useState } from "react";
import * as XLSX from "xlsx"; // ספרייה לקריאת קובצי אקסל
import styleStepTwo from "./Step2.module.css";

const Step2 = ({ formData, setFormData }) => {
  const [imageCount, setImageCount] = useState(0); // מספר התמונות שהועלו
  const [guestCount, setGuestCount] = useState(0); // מספר האורחים מהרשימה
  const [isExcelSelected, setIsExcelSelected] = useState(false);

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => {
      const existingImages = prev.images || [];
      const updatedImages = existingImages.concat(files);

      // סינון כפילויות (אם תרצה)
      const uniqueImages = Array.from(
        new Set(updatedImages.map((file) => file.name))
      ).map((name) => updatedImages.find((file) => file.name === name));

      return {
        ...prev,
        images: uniqueImages,
      };
    });

    setImageCount((prevCount) => prevCount + files.length);

    // איפוס ערך שדה הקלט
    e.target.value = null;
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      excelFile: file,
    }));
    setIsExcelSelected(true);

    // קריאת קובץ האקסל
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // בחירת הגיליון הראשון
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet); // המרת השורות למערך JSON
      setGuestCount(rows.length); // מספר השורות
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={styleStepTwo.step2Container}>
      <h2 className={styleStepTwo.header}>שלב 2: העלאת תמונות וקובץ אקסל</h2>

      <div className={styleStepTwo.uploadContainer}>
        {/* כרטיס להעלאת תמונות */}
        <div
          className={`${styleStepTwo.card} ${
            imageCount > 0 ? styleStepTwo.cardSelected : ""
          }`}
        >
          <div className={styleStepTwo.iconContainer}>
            <img
              src="/icons/upload-image.svg"
              alt="Upload Images"
              className={styleStepTwo.icon}
            />
          </div>
          <h3 className={styleStepTwo.cardHeader}>העלאת תמונות אירוע</h3>
          <input
            type="file"
            multiple
            onChange={handleImageFileChange}
            className={styleStepTwo.fileInput}
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className={styleStepTwo.uploadButton}>
            בחר תמונות
          </label>
          {imageCount > 0 && (
            <p className={styleStepTwo.successMessage}>
              {imageCount} {imageCount === 1 ? "תמונה" : "תמונות"} נבחרו בהצלחה!
            </p>
          )}
        </div>

        {/* כרטיס להעלאת קובץ אקסל */}
        <div
          className={`${styleStepTwo.card} ${
            isExcelSelected ? styleStepTwo.cardSelected : ""
          }`}
        >
          <div className={styleStepTwo.iconContainer}>
            <img
              src="/icons/upload-excel.svg"
              alt="Upload Excel"
              className={styleStepTwo.icon}
            />
          </div>
          <h3 className={styleStepTwo.cardHeader}>
            העלאת קובץ אקסל (רשימת אורחים)
          </h3>
          <input
            type="file"
            accept=".xlsx, .csv"
            onChange={handleExcelFileChange}
            className={styleStepTwo.fileInput}
            id="excelUpload"
          />
          <label htmlFor="excelUpload" className={styleStepTwo.uploadButton}>
            בחר קובץ
          </label>
          {isExcelSelected && guestCount > 0 && (
            <p className={styleStepTwo.successMessage}>
              {guestCount} {guestCount === 1 ? "אורח" : "אורחים"} נמצאו בקובץ!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2;
