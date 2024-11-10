import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const MatchedImages = ({ images }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  console.log("Is Mobile:", isMobile);
  const handleCheckboxChange = (e, filename) => {
    if (e.target.checked) {
      setSelectedImages([...selectedImages, filename]);
    } else {
      setSelectedImages(selectedImages.filter((img) => img !== filename));
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image to download.");
      return;
    }

    if (isMobile) {
      // הורדת תמונות בודדות למכשירים ניידים
      selectedImages.forEach((filename) => {
        const link = document.createElement("a");
        link.href = `http://localhost:5000/api/images/${encodeURIComponent(
          filename
        )}`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    } else {
      // הורדת ZIP למחשבים שולחניים
      const zip = new JSZip();
      const folder = zip.folder("matched_images");

      const fetchImage = async (filename) => {
        const response = await fetch(
          `http://localhost:5000/api/images/${encodeURIComponent(filename)}`
        );
        const blob = await response.blob();
        folder.file(filename, blob);
      };

      try {
        await Promise.all(
          selectedImages.map((filename) => fetchImage(filename))
        );
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "matched_images.zip");
      } catch (error) {
        console.error("Error downloading images:", error);
        alert("There was an error downloading the images.");
      }
    }
  };

  return (
    <div>
      <h2>Matched Event Images</h2>
      <button
        onClick={handleDownloadSelected}
        disabled={selectedImages.length === 0}
      >
        {isMobile
          ? "Download Selected (Individually)"
          : "Download Selected (ZIP)"}
      </button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((filename, index) => (
          <div key={index} style={{ margin: "10px", textAlign: "center" }}>
            <img
              src={`http://localhost:5000/api/images/${encodeURIComponent(
                filename
              )}`}
              alt="alt"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <p>{filename}</p>
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(e, filename)}
                checked={selectedImages.includes(filename)}
              />
              Select
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchedImages;
