import React, { useState } from "react";
import styleStepOne from "./Step1.module.css"; // חיבור לקובץ CSS Module

const Step1 = ({
  formData = {},
  handleChange = () => {},
  handleCoverImageChange = () => {},
}) => {
  const [successMessage, setSuccessMessage] = useState(false); // ניהול מצב ההודעה

  const saveStep1Data = () => {
    // בדיקה אם כל השדות הנדרשים מלאים
    const requiredFields = ["eventName", "location", "date", "eventType"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (missingFields.length > 0) {
      console.log("שדות חסרים:", missingFields); // כאן אפשר לטפל בשגיאות ידנית
      return;
    }

    // אם כל השדות מלאים, הצג הודעת הצלחה
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false); // הסתרת ההודעה אחרי 1.5 שניות
    }, 1500);

    console.log("כל השדות מולאו כהלכה. שמירת נתונים...");
  };

  return (
    <div className={styleStepOne.stepOneContainer}>
      {/* הודעת הצלחה */}
      {successMessage && (
        <div className={styleStepOne.successMessage}>המידע עלה בהצלחה!</div>
      )}

      <h2 className={styleStepOne.stepHeader}>שלב 1: יצירת אלבום</h2>
      <form className={styleStepOne.stepForm}>
        {/* שדה: שם האירוע */}
        <div className={styleStepOne.formGroup}>
          <label htmlFor="eventName" className={styleStepOne.formLabel}>
            בעלי הארוח:
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className={styleStepOne.formInput}
            placeholder="הכנס שם"
            required
          />
          {!formData.eventName && (
            <p className={styleStepOne.errorMessage}>יש להזין שם אירוע</p>
          )}
        </div>

        {/* שדה: מיקום */}
        <div className={styleStepOne.formGroup}>
          <label htmlFor="location" className={styleStepOne.formLabel}>
            מיקום האירוע:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styleStepOne.formInput}
            placeholder="הכנס מיקום"
            required
          />
          {!formData.location && (
            <p className={styleStepOne.errorMessage}>יש להזין מיקום</p>
          )}
        </div>

        {/* שדה: תאריך */}
        <div className={styleStepOne.formGroup}>
          <label htmlFor="date" className={styleStepOne.formLabel}>
            תאריך:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styleStepOne.formInput}
            required
          />
          {!formData.date && (
            <p className={styleStepOne.errorMessage}>יש לבחור תאריך</p>
          )}
        </div>

        {/* שדה: סוג האירוע */}
        <div className={styleStepOne.formGroup}>
          <label htmlFor="eventType" className={styleStepOne.formLabel}>
            סוג האירוע:
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className={styleStepOne.formInput}
            required
          >
            <option value="">בחר סוג אירוע</option>
            <option value="wedding">חתונה</option>
            <option value="party">מסיבה</option>
            <option value="barMitzvah">בר מצווה</option>
          </select>
          {!formData.eventType && (
            <p className={styleStepOne.errorMessage}>יש לבחור סוג אירוע</p>
          )}
        </div>

        {/* תמונה ראשית */}
        <div className={styleStepOne.formGroup}>
          <label htmlFor="coverImage" className={styleStepOne.formLabel}>
            תמונה ראשית חובה !:
          </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleCoverImageChange}
            className={styleStepOne.formFileInput}
          />
        </div>
      </form>

      {/* כפתור שמירה והמשך */}
      <button onClick={saveStep1Data} className={styleStepOne.saveButton}>
        שמור והמשך
      </button>
    </div>
  );
};

export default Step1;
