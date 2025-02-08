import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function OpenRoute({ component }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authenticateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/authenticate-user`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status !== 200)
        throw new Error('Error while autheticating user please login again!');

      const { user_id } = await response.json();

      if (user_id) navigate('/');
    } catch (error) {
      console.log(error, 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return <div>{!loading && component}</div>;
}
