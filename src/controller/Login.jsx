import { useState } from 'react';
import { emailValidation } from '../utils/validation';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({ email: false, credentials: false });
  const formChangeHandler = (event) => {
    setLoginData((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  const loginSubmitHandler = async () => {
    try {
      if (!emailValidation.test(loginData.email)) {
        console.log('email not valid...');
        setErrors((prevValue) => ({ ...prevValue, email: true }));
        return;
      }

      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
        credentials: 'include',
      });
      if (response.status !== 200)
        throw new Error('Error while logging in! please try again');
    } catch (error) {
      console.log(error, 'Error message');
      window.alert(error.message);
    }
  };
  return (
    <>
      <div>This is Login Page</div>
      <input type='text' name='email' onChange={formChangeHandler} />
      <input type='text' name='password' onChange={formChangeHandler} />
      <button onClick={loginSubmitHandler}>Submit</button>
    </>
  );
}
