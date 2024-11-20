// src/components/AllTheEvents/CreateEventSteps/Step3.jsx
import React, { useEffect, useState } from "react";
import styleStepThree from "./Step3.module.css";
const Step3 = ({ formData, setFormData }) => {
  const [coverImageURL, setCoverImageURL] = useState(null);

  useEffect(() => {
    let url = null;
    if (formData.albumImage instanceof Blob) {
      url = URL.createObjectURL(formData.albumImage);
      setCoverImageURL(url);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [formData.albumImage]);

  const handlePrivacyChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      isPrivate: value === "private",
    });
  };

  return (
    <div className={styleStepThree.stepThreeContainer}>
      <h2 className={styleStepThree.stepHeader}>שלב 3: סקירה ואישור</h2>

      {/* פרטי האירוע */}
      <div className={styleStepThree.eventDetails}>
        <h3 className={styleStepThree.subHeader}>פרטי האירוע</h3>
        <p>
          <strong>שם האירוע:</strong> {formData.eventName}
        </p>
        <p>
          <strong>מיקום:</strong> {formData.location}
        </p>
        <p>
          <strong>תאריך:</strong> {new Date(formData.date).toLocaleDateString()}
        </p>
        <p>
          <strong>סוג האירוע:</strong> {formData.eventType}
        </p>
      </div>

      {/* הגדרות פרטיות */}
      <div className={styleStepThree.privacySettings}>
        <h3 className={styleStepThree.subHeader}>הגדרות פרטיות</h3>
        <label className={styleStepThree.radioLabel}>
          <input
            type="radio"
            name="privacy"
            value="public"
            checked={formData.isPrivate === false}
            onChange={handlePrivacyChange}
          />
          אלבום ציבורי
        </label>
        <label className={styleStepThree.radioLabel}>
          <input
            type="radio"
            name="privacy"
            value="private"
            checked={formData.isPrivate === true}
            onChange={handlePrivacyChange}
          />
          אלבום פרטי
        </label>
      </div>

      {/* תמונת שער */}
      <div className={styleStepThree.coverImageContainer}>
        <h3 className={styleStepThree.subHeader}>תמונת שער</h3>
        {formData.albumImage && coverImageURL ? (
          <img
            src={coverImageURL}
            alt="Cover"
            className={styleStepThree.coverImage}
          />
        ) : (
          <p className={styleStepThree.errorText}>לא נטענה תמונת שער</p>
        )}
      </div>

      {/* קובץ רשימת אורחים */}
      <div className={styleStepThree.guestListContainer}>
        <h3 className={styleStepThree.subHeader}>קובץ רשימת אורחים</h3>
        {formData.excelFile ? (
          <p className={styleStepThree.fileName}>{formData.excelFile.name}</p>
        ) : (
          <p className={styleStepThree.errorText}>לא נטען קובץ רשימת אורחים</p>
        )}
      </div>
    </div>
  );
};

export default Step3;
