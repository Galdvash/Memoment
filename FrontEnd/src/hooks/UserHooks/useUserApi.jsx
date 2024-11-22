import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./userContextApp";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useApiUrl } from "../../hooks/ApiUrl/ApiProvider";

const useUserApi = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoginData, setIsLoginData] = useState({ email: "", password: "" });
  const [data, setIsData] = useState({
    name: "",
    email: "",
    phoneNumber: "", // שדה חדש למספר טלפון
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
    phoneNumber: Yup.string()
      .matches(/^0\d{8,9}$/, "Invalid phone number format") // פורמט תקין למספר טלפון ישראלי
      .required(),
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
    setIsLoading(true);
    if (await validate()) {
      try {
        const userData = { ...data };
        if (data.isBusiness) {
          userData.role = "business";
        }
        await axios.post(`${apiUrl}/api/users/register`, userData); // הוספת phoneNumber כאן
        toast.success("Registration successful! Please log in.");
        setIsSignIn(true);
        setIsData({
          name: "",
          email: "",
          phoneNumber: "", // איפוס השדה
          password: "",
          isBusiness: false,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed!");
      }
    }
    setIsLoading(false);
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // שליחה לשרת לקבלת טוקן
      const loginResponse = await axios.post(
        `${apiUrl}/api/users/login`,
        isLoginData
      );
      const token = loginResponse.data.token;
      localStorage.setItem("token", token);

      // שליפה של המידע על המשתמש מהשרת
      const userResponse = await axios.get(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // שמירת המידע על המשתמש בקונטקסט
      setUserInformation(userResponse.data);

      // הודעת הצלחה וניווט לפי תפקיד
      toast.success("Login successful!");
      setIsLoginData({ email: "", password: "" });

      if (userResponse.data.role === "user") {
        navigate("/regular-packages");
      } else if (userResponse.data.role === "business") {
        navigate("/packages");
      } else if (userResponse.data.role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // מחיקת הטוקן
    setUserInformation(null); // איפוס הסטייט של המשתמש בקונטקסט
    toast.success("Logged out successfully."); // הודעת הצלחה
    navigate("/"); // ניתוב למסך הבית
  };

  return {
    isSignIn,
    isLoading,
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
