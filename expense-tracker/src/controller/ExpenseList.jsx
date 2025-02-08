import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Context';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function ExpenseList() {
  const userData = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const getExpenses = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/get-all-expenses?currentUser=${userData.userId}`
      );
      if (!response.ok) throw new Error('Error while getting user data');

      const data = await response.json();
      console.log(data, 'data....');
    } catch (error) {
      console.log(error, 'error...');
    }
  };
  useEffect(() => {
    getExpenses();
  }, []);

  return <div>Expense List</div>;
}
