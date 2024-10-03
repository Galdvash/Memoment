// useGetAllUsers.js
import { useEffect, useState } from "react";
import axios from "axios";

const useGetAllUsers = (token) => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const config = {
        method: "get",
        url: "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        headers: {
          "x-auth-token": token,
        },
      };

      try {
        const response = await axios(config);
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, [token]);

  return allUsers;
};

export default useGetAllUsers;
