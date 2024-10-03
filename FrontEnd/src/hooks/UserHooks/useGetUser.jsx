import { useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./userContextApp";

const useGetUser = () => {
  const { userInformation, setUserInformation } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || userInformation) return;

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/me`,
        headers: {
          "x-auth-token": token,
        },
      };

      try {
        const response = await axios(config);
        setUserInformation(response.data);
        localStorage.setItem("user_id", response.data._id); // Save user ID to local storage
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [token, setUserInformation, userInformation]); // Added userInformation to the dependency array

  return { userInformation };
};

export default useGetUser;
