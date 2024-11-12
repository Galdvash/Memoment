import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./userContextApp";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup"; // ייבוא Yup
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

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
    isBusiness: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(""); // State לחוזק הסיסמה

  const { userInformation, setUserInformation } = useContext(UserContext);
  const apiUrl = useApiUrl();
  const navigate = useNavigate();

  const handleSignInClick = () => setIsSignIn(false);
  const handleSignUpClick = () => setIsSignIn(true);

  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3) return "Medium";
    if (strength >= 4) return "Strong";
    return "";
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setIsData((prevData) => ({
      ...prevData,
      password: value,
    }));
    const strength = evaluatePasswordStrength(value);
    setPasswordStrength(strength); // עדכון החוזק בסטייט
  };

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

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(256, "Name cannot exceed 256 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email must include a valid domain suffix (e.g., .com, .org)"
      )
      .min(5, "Email must be at least 5 characters long")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
  });

  const validate = async () => {
    try {
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validate()) {
      try {
        // קריאה להרשמה
        await axios.post(`${apiUrl}/api/users/register`, data);
        toast.success("Registration successful! Logging you in...");

        // כניסה אוטומטית לאחר ההרשמה
        const loginResponse = await axios.post(
          `${apiUrl}/api/users/login`,
          { email: data.email, password: data.password },
          { withCredentials: true }
        );

        // שמירת הטוקן ב-localStorage או ב-cookie
        const token = loginResponse.data.token;
        localStorage.setItem("token", token);

        // שליפת פרטי המשתמש ועדכון context
        const userResponse = await axios.get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUserInformation(userResponse.data);

        setIsData({ name: "", email: "", password: "", isBusiness: false });
        navigate("/packages"); // הפניה לעמוד לאחר התחברות
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
      const loginResponse = await axios.post(
        `${apiUrl}/api/users/login`,
        isLoginData,
        { withCredentials: true }
      );
      const token = loginResponse.data.token;
      localStorage.setItem("token", token); // שמירת הטוקן ב-localStorage
      toast.success("Login successful!");

      const userResponse = await axios.get(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
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
    passwordStrength,
    userInformation,
    handleSignInClick,
    handleSignUpClick,
    handleChange,
    handleSubmit,
    handleSubmit2,
    handlePasswordChange,
  };
};

export default useUserApi;
