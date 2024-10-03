import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useUserApi from "../../hooks/UserHooks/useUserApi";
import "./Register.css";

const SignInRegister = () => {
      const {
      isSignIn, errors, data, isLoginData,
      handleSignInClick, handleSignUpClick,
      handleChange, handleSubmit, handleSubmit2, } = useUserApi();

  return (
  <div className="bodyRegister bodyAbout">
    <ToastContainer />
    <div className={`container ${isSignIn ? "right-panel-active" : ""}`}>
      <div className="container__form container--signup">
        <form
                action="#"
                className="form formScroll"
                id="form1"
                onSubmit={handleSubmit}
              >
          <h2 className="form__title">Sign Up</h2>
          <input
                    type="text"
                    name="name.first"
                    placeholder="First Name"
                    className="input"
                    value={data.name.first}
                    onChange={handleChange}
                    required
                  />
          {errors.first && <p className="error">{errors.first}</p>}
          <input
                    type="text"
                    name="name.last"
                    placeholder="Last Name"
                    className="input"
                    value={data.name.last}
                    onChange={handleChange}
                    required
                  />
          {errors.last && <p className="error">{errors.last}</p>}
          <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="input"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
          {errors.email && <p classנהe="error">{errors.email}</p>}
          <input
                    name="phone"
                    type="text"
                    placeholder="Phone"
                    className="input"
                    value={data.phone}
                    onChange={handleChange}
                    required
                  />
          {errors.phone && <p className="error">{errors.phone}</p>}
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
          <input
                    name="image.url"
                    type="text"
                    placeholder="Image Url"
                    className="input"
                    value={data.image.url}
                    onChange={handleChange}
                  />
          {errors.url && <p className="error">{errors.url}</p>}
          <input
                    name="image.alt"
                    type="text"
                    placeholder="Image Description"
                    className="input"
                    value={data.image.alt}
                    onChange={handleChange}
                  />
          {errors.alt && <p className="error">{errors.alt}</p>}
          <input
                    name="address.state"
                    type="text"
                    placeholder="State"
                    className="input"
                    value={data.address.state}
                    onChange={handleChange}
                  />
          {errors.state && <p className="error">{errors.state}</p>}
          <input
                    name="address.country"
                    type="text"
                    placeholder="Country"
                    className="input"
                    value={data.address.country}
                    onChange={handleChange}
                    required
                  />
          {errors.country && <p className="error">{errors.country}</p>}
          <input
                    name="address.city"
                    type="text"
                    placeholder="City"
                    className="input"
                    value={data.address.city}
                    onChange={handleChange}
                    required
                  />
          {errors.city && <p className="error">{errors.city}</p>}
          <input
                    name="address.street"
                    type="text"
                    placeholder="Street"
                    className="input"
                    value={data.address.street}
                    onChange={handleChange}
                    required
                  />
          {errors.street && <p className="error">{errors.street}</p>}
          <input
                    name="address.houseNumber"
                    type="text"
                    placeholder="House Number"
                    className="input"
                    value={data.address.houseNumber}
                    onChange={handleChange}
                    required
                  />
          {errors.houseNumber && (
          <p className="error">{errors.houseNumber}</p>
          )}
          <input
                    name="address.zip"
                    type="text"
                    placeholder="ZIP Code"
                    className="input"
                    value={data.address.zip}
                    onChange={handleChange}
                    required
                  />
          <input
                    name="isBusiness"
                    checked={data.isBusiness}
                    type="checkbox"
                    className="checkbox"
                    onChange={handleChange}
                  />
            {errors.isBusiness && <p className="error">{errors.isBusiness}</p>}
          <button className="btn">Sign Up</button>
        </form>
        </div>
        {/* Login */}
        <div className="container__form container--signin">
        <form action="#" className="form" id="form2" onSubmit={handleSubmit2}>
            <h2 className="form__title">Sign In</h2>
            <input
                      type="email"
                      placeholder="Email"
                      className="input"
                      name="email"
                      value={isLoginData.email} onChange={handleChange}
                    />
            <input
                      type="password" placeholder="Password" className="input"  name="password"  value={isLoginData.password} onChange={handleChange}
                    />
            <button className="btn">Sign In</button>
        </form>
        </div>
        <div className="container__overlay">
        <div className="overlay">
          <div className="overlay__panel overlay--left">
           <button className="btn" id="signIn" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
         <div className="overlay__panel overlay--right">
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