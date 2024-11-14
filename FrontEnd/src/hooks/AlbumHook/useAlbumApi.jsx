// hooks/useAlbumApi.jsx
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";
import axios from "axios";
import { useState } from "react";

const useAlbumApi = () => {
  const apiUrl = useApiUrl();
  const [albumId, setAlbumId] = useState(null);

  const createAlbum = async (albumData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/albums/create`,
        albumData
      );
      setAlbumId(response.data.album._id);
      return response.data;
    } catch (error) {
      console.error("Error creating album:", error);
      throw error;
    }
  };

  const uploadCoverImage = async (file) => {
    if (!albumId) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const response = await axios.post(
        `${apiUrl}/api/albums/cover/${albumId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading cover image:", error);
      throw error;
    }
  };

  const addImagesToAlbum = async (files) => {
    if (!albumId) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const response = await axios.post(
        `${apiUrl}/api/albums/images/${albumId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding images to album:", error);
      throw error;
    }
  };

  return {
    createAlbum,
    uploadCoverImage,
    addImagesToAlbum,
    albumId,
  };
};

export default useAlbumApi;
