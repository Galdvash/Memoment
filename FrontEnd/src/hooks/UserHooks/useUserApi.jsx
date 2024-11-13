import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./userContextApp";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

const useUserApi = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoginData, setIsLoginData] = useState({ email: "", password: "" });
  const [data, setIsData] = useState({
    name: "",
    email: "",
    password: "",
    isBusiness: false,
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  const { userInformation, setUserInformation } = useContext(UserContext);
  const apiUrl = useApiUrl();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUserInformation(response.data))
        .catch(() => setUserInformation(null));
    }
  }, [apiUrl, setUserInformation]);

  const handleSignInClick = () => setIsSignIn(false);
  const handleSignUpClick = () => setIsSignIn(true);

  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength <= 2 ? "Weak" : strength === 3 ? "Medium" : "Strong";
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setIsData((prevData) => ({ ...prevData, password: value }));
    setPasswordStrength(evaluatePasswordStrength(value));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setIsData((prevData) => ({ ...prevData, [name]: updatedValue }));
    setIsLoginData((prevData) => ({ ...prevData, [name]: updatedValue }));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(3).max(256).required(),
    email: Yup.string().email().min(5).required(),
    password: Yup.string()
      .required()
      .min(8)
      .matches(/[A-Z]/)
      .matches(/[a-z]/)
      .matches(/\d/)
      .matches(/[@$!%*?&]/),
  });

  const validate = async () => {
    try {
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => (newErrors[error.path] = error.message));
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validate()) {
      try {
        await axios.post(`${apiUrl}/api/users/register`, data);
        toast.success("Registration successful! Please log in.");
        setIsSignIn(true);
        setIsData({ name: "", email: "", password: "", isBusiness: false });
      } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed!");
      }
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post(
        `${apiUrl}/api/users/login`,
        isLoginData
      );
      const token = loginResponse.data.token;
      localStorage.setItem("token", token); // Save token to localStorage

      toast.success("Login successful!");

      const userResponse = await axios.get(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInformation(userResponse.data);
      setIsLoginData({ email: "", password: "" });
      navigate("/packages");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setUserInformation(null);
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return {
    isSignIn,
    errors,
    data,
    isLoginData,
    passwordStrength,
    userInformation,
    handleSignInClick,
    handleSignUpClick,
    handleChange,
    handleSubmit,
    handleSubmit2,
    handlePasswordChange,
    handleLogout,
  };
};

export default useUserApi;
