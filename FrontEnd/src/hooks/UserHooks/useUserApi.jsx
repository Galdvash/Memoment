
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { UserContext } from "./userContextApp";

const useUserApi = () => {
const [isSignIn, setIsSignIn] = useState(false);
const [errors, setErrors] = useState({});
const [isLoginData, setIsLoginData] = useState({
email: "", password: "",});
const [data, setIsData] = useState({
name: { first: "", middle: "", last: "" },
phone: "",
email: "",
password: "",
image: { url: "", alt: "" },
address: { state: "",country: "",city: "",street: "",houseNumber: "",zip: "",},
isBusiness: false,
isAdmin: false,
});
const { userInformation, setUserInformation } = useContext(UserContext);

useEffect(() => {
const storedUserInfo = localStorage.getItem("userInfo");
if (storedUserInfo) {
const decoded = JSON.parse(storedUserInfo);
setUserInformation(decoded);
console.log(decoded);
}
}, [setUserInformation]);

console.log(userInformation);

const handleSignInClick = () => {
setIsSignIn(false);
};

const handleSignUpClick = () => {
setIsSignIn(true);
};

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
const updatedValue = type === "checkbox" ? checked : value;

setIsData((prevData) => {
  const keys = name.split(".");
  if (keys.length > 1) {
    return {
      ...prevData,
      [keys[0]]: {
        ...prevData[keys[0]],
        [keys[1]]: updatedValue,
      },
    };
  } else {
    return {
      ...prevData,
      [name]: updatedValue,
    };
  }
});
setIsLoginData({ ...isLoginData, [e.target.name]: e.target.value });
};

const validate = () => {
const newErrors = {};

const validateField = (key, value) => {
  switch (key) {
    case "name.first":
      if (!value || value.length < 2 || value.length > 256) {
        newErrors.first =
          "First name must be between 2 and 256 characters.";
      }
      console.log(newErrors.first);
      break;
    case "name.middle":
      if (value && (value.length < 2 || value.length > 256)) {
        newErrors.middle =
          "Middle name must be between 2 and 256 characters.";
      }
      break;
    case "name.last":
      if (!value || value.length < 2 || value.length > 256) {
        newErrors.last = "Last name must be between 2 and 256 characters.";
      }
      break;
    case "phone":
      if (!value || value.length < 9 || value.length > 11) {
        newErrors.phone =
          "Phone number must be between 9 and 11 characters.";
      }
      break;
    case "email":
      if (!value || value.length < 5) {
        newErrors.email = "Email must be at least 5 characters long.";
      }
      break;
    case "password":
      if (!value || value.length < 7 || value.length > 20) {
        newErrors.password =
          "Password must be between 7 and 20 characters.";
      }
      break;
    case "image.url":
      if (value && value.length < 14) {
        newErrors.url = "Image URL must be at least 14 characters long.";
      }
      break;
    case "image.alt":
      if (value && (value.length < 2 || value.length > 256)) {
        newErrors.alt =
          "Image description must be between 2 and 256 characters.";
      }
      break;
    case "address.state":
      if (value && (value.length < 2 || value.length > 256)) {
        newErrors.state = "State must be between 2 and 256 characters.";
      }
      break;
    case "address.country":
      if (!value || value.length < 2 || value.length > 256) {
        newErrors.country = "Country must be between 2 and 256 characters.";
      }
      break;
    case "address.city":
      if (!value || value.length < 2 || value.length > 256) {
        newErrors.city = "City must be between 2 and 256 characters.";
      }
      break;
    case "address.street":
      if (!value || value.length < 2 || value.length > 256) {
        newErrors.street = "Street must be between 2 and 256 characters.";
      }
      break;
    case "address.houseNumber":
      if (!value || value < 2 || value > 256) {
        newErrors.houseNumber = "House number must be between 2 and 256.";
      }
      break;
    case "isBusiness":
      if (typeof value !== "boolean") {
        newErrors.isBusiness = "Business status must be specified.";
      }
      break;
    case "isAdmin":
      if (typeof value !== "boolean") {
        newErrors.isAdmin = "Admin status must be specified.";
      }
      break;
    default:
      break;
  }
};

const validateObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      validateObject(obj[key]);
    } else {
      validateField(key, obj[key]);
    }
  });
};
validateObject(data);
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (validate()) {
  const configRegister = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
  headers: {},
  data: data,
  };
  try {
    const response = await axios(configRegister);
    toast.success("Registration successful!");
    setIsData({
    name: { first: "", middle: "", last: "" },
    phone: "",email: "",password: "",
    image: { url: "", alt: "" },
    address: {state: "",country: "", city: "",street: "",houseNumber: "",zip: "",}
    ,isBusiness: false,isAdmin: false,
    })
  return response;
  } catch (error) {
  console.error(error);
  toast.error("Registration failed!");
  }
  } else {
  console.log("Validation failed");
  }
  };
//lOGIN
const handleSubmit2 = async (e) => {
e.preventDefault();
const configLoding = {
method: "post",
maxBodyLength: Infinity,
url: "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
headers: {},
data: {
email: isLoginData.email,
password: isLoginData.password,
},
};
try {
const response = await axios(configLoding);
console.log(response.data);
const getToken = response.data;
const decoded = jwtDecode(getToken);
console.log(decoded);
setUserInformation(decoded);
localStorage.setItem("token", getToken);
setIsLoginData({email: "",password: "", });
toast.success("Login successful!");
} catch (error) {
console.error(error);
toast.error("Login failed!");
}
};
return {
isSignIn,errors,data, isLoginData,
handleSignInClick, handleSignUpClick, handleChange, handleSubmit, handleSubmit2,
};
};

export default useUserApi;