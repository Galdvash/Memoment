import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const MatchedImages = ({ matchedImages, albumId }) => {
  const handleDownloadSelected = async () => {
    const zip = new JSZip();
    const folder = zip.folder(`matched_images_album_${albumId}`);

    const downloadPromises = matchedImages.map(async (image) => {
      try {
        const response = await fetch(image.downloadUrl);
        const blob = await response.blob();
        folder.file(image.filename, blob);
      } catch (error) {
        console.error(`Error downloading image ${image.filename}:`, error);
      }
    });

    try {
      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `matched_images_album_${albumId}.zip`);
    } catch (error) {
      console.error("Error generating ZIP:", error);
    }
  };

  return (
    <div>
      <h2>Matched Images for Album {albumId}</h2>
      <div>
        {matchedImages && matchedImages.length > 0 ? (
          matchedImages.map((image, index) => (
            <img
              key={index}
              src={`data:${image.cotec};base64,${image.data}`}
              alt={`Matched image: ${image.filename}`}
              style={{
                width: "100px",
                height: "100px",
                margin: "5px",
                objectFit: "cover",
              }}
            />
          ))
        ) : (
          <p>No matched images found for this album.</p>
        )}
      </div>
      {matchedImages && matchedImages.length > 0 && (
        <button onClick={handleDownloadSelected}>Download All</button>
      )}
    </div>
  );
};

export default MatchedImages;
