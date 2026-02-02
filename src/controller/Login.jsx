import { useState } from "react";
import { emailValidation } from "../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const router = useNavigate();
  const { updateLoginState } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: false, credentials: false });

  const formChangeHandler = (event) => {
    setErrors({ email: false, credentials: false });
    setLoginData((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  const loginSubmitHandler = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (!emailValidation.test(loginData.email)) {
        setErrors((prevValue) => ({ ...prevValue, email: true }));
        return;
      }

      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
        credentials: "include",
      });

      if (response.status !== 200)
        throw new Error("Error while logging in! please try again");

      const { userId, username } = await response.json();

      updateLoginState(userId, username);
      router("/");
    } catch (error) {
      console.log(error, "Error message");
      window.alert(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="login-container">
        <div className="login-layout-logo">
          <div className="login-logo-container">
            <img className="login-logo" src="/dollar-logo.svg" />
          </div>
        </div>
        <div className="login-layout-input login-input-container">
          <div className="login-label-input-container">
            <label className="login-input-label">Email</label>
            <input
              className="login-input"
              type="text"
              name="email"
              onChange={formChangeHandler}
            />
            {errors.email && (
              <div className="login-error">
                Please enter a valid email address
              </div>
            )}
          </div>
          <div className="login-label-input-container">
            <label className="login-input-label">Password</label>
            <input
              className="login-input"
              type="text"
              name="password"
              onChange={formChangeHandler}
            />
          </div>
          <button className="login-button" onClick={loginSubmitHandler}>
            Submit
          </button>
          <div className="login-dont-have-account">
            <Link to={"/signup"}>Don't have an account? Signup</Link>
          </div>
        </div>
      </div>
    </>
  );
}
