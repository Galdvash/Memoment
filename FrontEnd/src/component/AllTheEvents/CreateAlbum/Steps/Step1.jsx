// src/components/AllTheEvents/CreateAlbum/Steps/Step1.jsx
import React from "react";

const Step1 = ({ formData, handleChange, handleCoverImageChange }) => (
  <div>
    <h2>Step 1: Create Album</h2>
    <form>
      <label>
        Event Name:
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange} // שימוש ב-handleChange
          placeholder="Enter event name"
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange} // שימוש ב-handleChange
          placeholder="Enter location"
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange} // שימוש ב-handleChange
        />
      </label>
      <label>
        Event Type:
        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange} // שימוש ב-handleChange
        >
          <option value="">Select event type</option>
          <option value="wedding">חתונה</option>
          <option value="party">מסיבה</option>
          <option value="barMitzvah">בר מצווה</option>
        </select>
      </label>
      <label>
        Cover Image:
        <input
          type="file"
          name="coverImage"
          onChange={handleCoverImageChange}
        />
      </label>
    </form>
  </div>
);

export default Step1;
