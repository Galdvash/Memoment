import { useEffect, useState } from "react";
import axios from "axios";

const useGetAllUsers = (token) => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const config = {
        method: "get",
        url: "http://localhost:5000/api/users", // עדכן את כתובת ה-API
        headers: {
          Authorization: `Bearer ${token}`, // שימוש ב-JWT לטוקן
        },
      };

      try {
        const response = await axios(config);
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    if (token) {
      fetchAllUsers();
    }
  }, [token]);

  return allUsers;
};

export default useGetAllUsers;
