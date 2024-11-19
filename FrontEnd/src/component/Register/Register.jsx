import React from "react";
import { Link } from "react-router-dom"; // הוסף את השימוש ב-React Router
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserApi from "../../hooks/UserHooks/useUserApi";
import "./Register.css";
import "./RegisterMedia.css";

const SignInRegister = () => {
  const {
    isSignIn,
    errors,
    data,
    isLoginData,
    passwordStrength,
    handleSignInClick,
    handleSignUpClick,
    handleChange,
    handleSubmit,
    handleSubmit2,
    handlePasswordChange,
  } = useUserApi();

  return (
    <div className="bodyRegister bodyAbout">
      <ToastContainer />
      <div className={`container ${isSignIn ? "right-panel-active" : ""}`}>
        {/* Sign Up Form */}
        <div className="container__form container--signup">
          <form className="form" id="form1" onSubmit={handleSubmit}>
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
              onChange={handlePasswordChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
            {/* Phone Number Field */}
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className="input"
              value={data.phoneNumber}
              onChange={handleChange}
              required
            />
            {errors.phoneNumber && (
              <p className="error">{errors.phoneNumber}</p>
            )}

            {/* Checkbox for Business Account */}
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isBusiness"
                checked={data.isBusiness}
                onChange={(e) =>
                  handleChange({
                    target: { name: "isBusiness", value: e.target.checked },
                  })
                }
              />
              Register as Business
            </label>
            {/* Password Strength Meter */}
            <div className="password-strength">
              <p>
                Password Strength: <strong>{passwordStrength}</strong>
              </p>
              <div
                className={`strength-meter ${passwordStrength.toLowerCase()}`}
              ></div>
            </div>

            {/* Sign Up Button */}
            <button className="btn" type="submit">
              Sign Up
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className="container__form container--signin">
          <form className="form" id="form2" onSubmit={handleSubmit2}>
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
            {errors.email && <p className="error">{errors.email}</p>}

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
            {errors.password && <p className="error">{errors.password}</p>}

            {/* Sign In Button */}
            <button className="btn" type="submit">
              Sign In
            </button>
            <Link to="/forgot-password" className="forgot-password-link">
              שכחתי את הסיסמה
            </Link>
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
