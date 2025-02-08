import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function ProtectedRoute({ component }) {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
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

      const { user_id, name } = await response.json();
      setUserName(name);
      console.log(user_id, 'userId');
      if (!user_id) navigate('/login');

      setUserId(user_id);
    } catch (error) {
      console.log(error, 'error');
      navigate('/login');
    }
    setLoading(false);
  };

  useEffect(() => {}, [userId]);

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      <div style={{ color: '#00008B', fontSize: '32px' }}>{userName}</div>
      {!loading && userId && component}
    </UserContext.Provider>
  );
}
