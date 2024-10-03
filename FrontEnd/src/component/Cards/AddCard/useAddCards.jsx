import { useState, useEffect } from "react";

const useAddCards = () => {
  const [isClick, setIsClick] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: { 
      url: "",
      alt: ""
    },
    city: "",
    country: "",
    state: "",
    street: "",
    houseNumber: "",
    zip: ""
  });

  useEffect(() => {
    const isValid = formData.title &&
      formData.subtitle &&
      formData.description &&
      formData.phone &&
      formData.email &&
      formData.city &&
      formData.country &&
      formData.street &&
      formData.houseNumber &&
      formData.zip;

    setFormValid(isValid);
  }, [formData]);

  const closeForm = () => {
    setIsClick(false);
  }

  const OpenAndCloseCard = () => {
    setIsClick(prevIsClick => !prevIsClick);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name.startsWith("image")) {
        return {
          ...prevData,
          image: {
            ...prevData.image,
            [name.split(".")[1]]: value
          }
        }
      } else {
        return {
          ...prevData,
          [name]: value,
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid) {
      console.log("Form submitted:", formData);
      // Handle form submission logic here
    }
  };

  return { isClick, OpenAndCloseCard, handleChange, handleSubmit, formValid, formData, setIsClick, closeForm };
};

export default useAddCards;
