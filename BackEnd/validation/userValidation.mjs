import Joi from "joi";

export const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be less than 255 characters",
    }),
    email: Joi.string().min(5).max(255).email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "string.min": "Email must be at least 5 characters long",
      "string.max": "Email must be less than 255 characters",
    }),
    phoneNumber: Joi.string()
      .pattern(/^0\d{9}$/)
      .allow(null, "")
      .messages({
        "string.pattern.base":
          "Phone number must start with 0 and have 10 digits",
        "string.empty": "Phone number is required",
      }),
    password: Joi.string().min(6).max(255).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must be less than 255 characters",
    }),
    isBusiness: Joi.boolean().default(false).messages({
      "boolean.base": "isBusiness must be a boolean value",
    }),
    role: Joi.string()
      .valid("user", "business", "admin")
      .default("user")
      .messages({
        "string.empty": "Role is required",
        "any.only": "Role must be either 'user', 'business' or 'admin'",
      }),
  });

  return schema.validate(data);
};
