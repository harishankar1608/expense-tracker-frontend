import { useState } from 'react';
import {
  emailValidation,
  nameValidation,
  passwordValidation,
} from '../utils/validation';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Signup() {
  const [signupData, setSignupData] = useState({
    name: { value: '', error: false },
    email: { value: '', error: false },
    password: { value: '', error: false },
    confirmPassword: { value: '', error: false },
  });
  const createUser = async () => {
    try {
      const errors = {
        name: false,
        email: false,
        password: false,
      };

      if (!nameValidation.test(signupData.name.value)) errors.name = true;
      if (!emailValidation.test(signupData.email.value)) errors.email = true;
      if (!passwordValidation.test(signupData.password.value))
        errors.password = true;
      console.log(errors, 'error object');
      if (Object.values(errors).includes(true)) {
        setSignupData((prevValue) => {
          const updatedSignupData = { ...prevValue };
          Object.keys(errors).forEach(
            (error) => (updatedSignupData[error].error = errors[error])
          );
          return updatedSignupData;
        });

        return;
      }

      if (signupData.password.value !== signupData.confirmPassword.value) {
        setSignupData((prevValue) => ({
          ...prevValue,
          confirmPassword: {
            value: prevValue.confirmPassword.value,
            error: true,
          },
        }));
        console.log('confirm password should match password');
        return;
      }

      const response = await fetch(`${backendUrl}/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name.value,
          email: signupData.email.value,
          password: signupData.password.value,
        }),
      });

      if (!response.ok)
        throw new Error('Error while creating account for user');

      console.log('Account created successfully');
    } catch (error) {
      console.log(error, 'Error while creating new User');
    }
  };

  const formChangeHandler = (event) => {
    setSignupData((prevValue) => ({
      ...prevValue,
      [event.target.name]: { value: event.target.value, error: false },
    }));
  };

  console.log(signupData, 'signupdate');
  return (
    <>
      <div>This is the Sign up page</div>
      <label htmlFor='signup-name'>Name</label>
      <input
        id='signup-name'
        type='text'
        name='name'
        value={signupData.name.value}
        onChange={formChangeHandler}
      />
      <br />
      <label htmlFor='signup-email'>Email</label>
      <input
        id='signup-email'
        type='text'
        name='email'
        value={signupData.email.value}
        onChange={formChangeHandler}
      />
      <br />
      <label htmlFor='signup-password'>Password</label>
      <input
        id='signup-password'
        type='text'
        name='password'
        value={signupData.password.value}
        onChange={formChangeHandler}
      />
      <br />
      <label htmlFor='signup-confirm-password'>Confirm Password</label>
      <input
        id='signup-confirm-password'
        type='text'
        name='confirmPassword'
        value={signupData.confirmPassword.value}
        onChange={formChangeHandler}
      />
      <br />
      <button onClick={createUser}>Create Account</button>
    </>
  );
}
