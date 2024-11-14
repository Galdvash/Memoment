// src/components/AllTheEvents/CreateEventSteps/Step3.jsx
import React, { useEffect, useState } from "react";

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
    console.log("Updated form data (Step3 - privacy):", {
      ...formData,
      [name]: checked,
    });
  };

  return (
    <div>
      <h2>שלב 3: סקירה ואישור</h2>

      <div>
        <h3>פרטי האירוע</h3>
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

      <div>
        <h3>הגדרות פרטיות</h3>
        <label>
          <input
            type="checkbox"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleCheckboxChange}
          />
          האלבום פרטי
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            name="isPublic"
            checked={!formData.isPrivate}
            onChange={(e) =>
              handleCheckboxChange({
                target: { name: "isPrivate", checked: !e.target.checked },
              })
            }
          />
          האלבום ציבורי
        </label>
      </div>

      <div>
        <h3>תמונת שער</h3>
        {formData.albumImage && coverImageURL ? (
          <img
            src={coverImageURL}
            alt="Cover"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        ) : (
          <p>לא נטענה תמונת שער</p>
        )}
      </div>

      <div>
        <h3>קובץ רשימת אורחים</h3>
        {formData.excelFile && <p>{formData.excelFile.name}</p>}
      </div>
    </div>
  );
};

export default Step3;
