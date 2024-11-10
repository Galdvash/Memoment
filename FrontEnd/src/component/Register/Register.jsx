// components/Register/SignInRegister.jsx

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserApi from "../../hooks/UserHooks/useUserApi";
import "./Register.css";

const SignInRegister = () => {
  const {
    isSignIn,
    errors,
    data,
    isLoginData,
    handleSignInClick,
    handleSignUpClick,
    handleChange,
    handleSubmit,
    handleSubmit2,
  } = useUserApi();

  return (
    <div className="bodyRegister bodyAbout">
      <ToastContainer />
      <div className={`container ${isSignIn ? "right-panel-active" : ""}`}>
        {/* Sign Up Form */}
        <div className="container__form container--signup">
          <form action="#" className="form" id="form1" onSubmit={handleSubmit}>
            <h2 className="form__title">Sign Up</h2>
            {/* Name Field */}
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="input"
              value={data.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
            {/* Email Field */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input"
              value={data.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
            {/* Password Field */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              value={data.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
            {/* Sign Up Button */}
            <button className="btn">Sign Up</button>
          </form>
        </div>
        {/* Login Form */}
        <div className="container__form container--signin">
          <form action="#" className="form" id="form2" onSubmit={handleSubmit2}>
            <h2 className="form__title">Sign In</h2>
            {/* Email Field */}
            <input
              type="email"
              placeholder="Email"
              className="input"
              name="email"
              value={isLoginData.email}
              onChange={handleChange}
              required
            />
            {/* Password Field */}
            <input
              type="password"
              placeholder="Password"
              className="input"
              name="password"
              value={isLoginData.password}
              onChange={handleChange}
              required
            />
            {/* Sign In Button */}
            <button className="btn">Sign In</button>
          </form>
        </div>
        {/* Overlay Panels */}
        <div className="container__overlay">
          <div className="overlay">
            <div className="overlay__panel overlay--left">
              <button className="btn" id="signIn" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay__panel overlay--right">
              <h3>Memoment</h3>
              <p>
                Share your guests' most beautiful moments with facial
                recognition.
              </p>
              <p>The guest sends a selfie and instantly finds their photos.</p>
              <p>Easy, fast, and efficient.</p>
              <button className="btn" id="signUp" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInRegister;
