// // src/component/AllTheEvents/Albums/AlbumEditForm.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import styles from "./AlbumEditForm.module.css";

// const AlbumEditForm = ({ album, onUpdate, apiUrl, token }) => {
//   const [formData, setFormData] = useState({
//     eventName: album.eventName || "",
//     location: album.location || "",
//     date: album.date ? album.date.split("T")[0] : "",
//     eventType: album.eventType || "",
//     isPrivate: album.isPrivate || false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // יצירת אובייקט עם שדות שהשתנו בלבד
//       const updatedFields = {};
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] !== album[key]) {
//           updatedFields[key] = formData[key];
//         }
//       });

//       // בדיקה אם לא נעשו שינויים
//       if (Object.keys(updatedFields).length === 0) {
//         alert("No changes made");
//         return;
//       }

//       // שליחת הנתונים לשרת
//       const response = await axios.put(
//         `${apiUrl}/api/albums/${album._id}`,
//         updatedFields,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data) {
//         console.log("Updated album:", response.data);
//       }
//       // עדכון נתוני האלבום בקומפוננטת האב
//       if (onUpdate) {
//         onUpdate({ ...album, ...updatedFields });
//       }

//       alert("Album updated successfully!");
//     } catch (error) {
//       console.error("Error updating album:", error);
//       if (error.response && error.response.status === 413) {
//         alert("Payload too large. Please upload smaller files.");
//       } else {
//         alert("Failed to update album.");
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className={styles.albumEditForm}>
//       <div>
//         <label>Event Name:</label>
//         <input
//           type="text"
//           name="eventName"
//           value={formData.eventName}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Location:</label>
//         <input
//           type="text"
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Date:</label>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Event Type:</label>
//         <input
//           type="text"
//           name="eventType"
//           value={formData.eventType}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>
//           Private:
//           <input
//             type="checkbox"
//             name="isPrivate"
//             checked={formData.isPrivate}
//             onChange={handleChange}
//           />
//         </label>
//       </div>
//       <button type="submit">Update Album</button>
//     </form>
//   );
// };

// export default AlbumEditForm;
