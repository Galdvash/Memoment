import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./userContextApp";
import { useNavigate } from "react-router-dom";

const useUserApi = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoginData, setIsLoginData] = useState({
    email: "",
    password: "",
  });
  const [data, setIsData] = useState({
    name: "",
    email: "",
    password: "",
    isBusiness: false, // עבור יוצרי אירועים
  });

  const { userInformation, setUserInformation } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignInClick = () => setIsSignIn(false);
  const handleSignUpClick = () => setIsSignIn(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    setIsData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    setIsLoginData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!data.name || data.name.length < 2 || data.name.length > 256) {
      newErrors.name = "Name must be between 2 and 256 characters.";
    }
    if (!data.email || data.email.length < 5) {
      newErrors.email = "Email must be at least 5 characters long.";
    }
    if (
      !data.password ||
      data.password.length < 7 ||
      data.password.length > 20
    ) {
      newErrors.password = "Password must be between 7 and 20 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/users/register`,
          data,
          {
            withCredentials: true,
          }
        );
        toast.success("Registration successful!");

        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/me`,
          { withCredentials: true }
        );
        setUserInformation(userResponse.data);

        setIsData({ name: "", email: "", password: "", isBusiness: false });
        navigate("/packages");
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed!");
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        isLoginData,
        {
          withCredentials: true,
        }
      );
      toast.success("Login successful!");

      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/me`,
        { withCredentials: true }
      );
      setUserInformation(userResponse.data);

      setIsLoginData({ email: "", password: "" });
      navigate("/packages");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return {
    isSignIn,
    errors,
    data,
    isLoginData,
    userInformation,
    handleSignInClick,
    handleSignUpClick,
    handleChange,
    handleSubmit,
    handleSubmit2,
  };
};

export default useUserApi;
