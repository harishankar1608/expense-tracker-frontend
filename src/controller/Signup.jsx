import { useState } from "react";
import {
  emailValidation,
  nameValidation,
  passwordValidation,
} from "../utils/validation";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Signup() {
  const router = useNavigate();

  const [signupData, setSignupData] = useState({
    name: { value: "", error: false },
    email: { value: "", error: false },
    password: { value: "", error: false },
    confirmPassword: { value: "", error: false },
  });

  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const createUser = async () => {
    try {
      const errors = {
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      };

      if (!nameValidation.test(signupData.name.value)) errors.name = true;
      if (!emailValidation.test(signupData.email.value)) errors.email = true;
      if (!passwordValidation.test(signupData.password.value))
        errors.password = true;

      if (Object.values(errors).includes(true)) {
        setError(errors);
        return;
      }

      if (signupData.password.value !== signupData.confirmPassword.value) {
        errors.confirmPassword = true;
        setError(errors);
        return;
      }

      const response = await fetch(`${backendUrl}/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name.value,
          email: signupData.email.value,
          password: signupData.password.value,
        }),
      });

      if (!response.ok)
        throw new Error("Error while creating account for user");

      router("/login");
    } catch (error) {
      console.log(error, "Error while creating new User");
    }
  };

  const formChangeHandler = (event) => {
    setSignupData((prevValue) => ({
      ...prevValue,
      [event.target.name]: { value: event.target.value, error: false },
    }));
  };

  return (
    <div className="signup-container">
      <div className="signup-input-containers">
        <label htmlFor="signup-name">Name</label>
        <input
          id="signup-name"
          type="text"
          name="name"
          value={signupData.name.value}
          onChange={formChangeHandler}
        />
        {error.name && (
          <div className="signup-error">Please enter a valid name</div>
        )}
      </div>
      <div className="signup-input-containers">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="text"
          name="email"
          value={signupData.email.value}
          onChange={formChangeHandler}
        />
        {error.email && (
          <div className="signup-error">Please enter a valid email</div>
        )}
      </div>
      <div className="signup-input-containers">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="text"
          name="password"
          value={signupData.password.value}
          onChange={formChangeHandler}
        />

        {error.password && (
          <div className="signup-error">
            Password should contain alteast 1 capital case and a number
          </div>
        )}
      </div>
      <div className="signup-input-containers">
        <label htmlFor="signup-confirm-password">Confirm Password</label>
        <input
          id="signup-confirm-password"
          type="text"
          name="confirmPassword"
          value={signupData.confirmPassword.value}
          onChange={formChangeHandler}
        />
        {error.confirmPassword && (
          <div className="signup-error">
            Password and confirm password does not match
          </div>
        )}
      </div>
      <button className="signup-button" onClick={createUser}>
        Create Account
      </button>
      <Link to="/login" className="signup-to-login-button">
        Already have an account?
      </Link>
    </div>
  );
}
