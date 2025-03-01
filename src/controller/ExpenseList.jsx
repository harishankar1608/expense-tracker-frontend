import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Context';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function ExpenseList() {
  const userData = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  const [expenses, setExpenses] = useState([]);
  const [totalFriendExpense, setTotalFriendExpense] = useState(null);
  const [totalSelfExpense, setTotalSelfExpense] = useState(null);
  const [friendsData, setFriendsData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const getExpenses = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/get-all-expenses?currentUser=${userData.userId}`
      );
      if (!response.ok) throw new Error('Error while getting user data');

      const data = await response.json();
      if (!data?.friends) {
        setInfo('No Friends found');
      }

      if (!data?.expenses) {
        setInfo('No Expenses found');
        return;
      }

      setExpenses(data.expenses);
      setFriendsData(data.friends);
    } catch (error) {
      console.log(error, 'error...');
    }
  };

  console.log(expenses, 'expenses array');

  const convertExpenseData = (expenses) => {
    let selfExpense = 0;
    const friendsExpensesConverted = {}; //{'friend_user_id':[{expense1},expense2]}
    expenses.forEach((expense) => {
      if (expense?.lender === null) {
        //self expense
        selfExpense += Number(expense.amount);
      } else {
        if (expense.lender === userData.userId) {
          //lended by current user
          const expenseAccumulator =
            friendsExpensesConverted?.[expense.borrower] || 0;
          friendsExpensesConverted[expense.borrower] =
            expenseAccumulator + Number(expense.amount);
        } else {
          //borrowed by current user
          const expenseAccumulator =
            friendsExpensesConverted?.[expense.lender] || 0;
          friendsExpensesConverted[expense.lender] =
            expenseAccumulator - Number(expense.amount);
        }
      }
    });
    return { friendsExpensesConverted, selfExpense };
  };

  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(() => {
    if (expenses.length === 0) return;
    const totalExpenses = expenses.reduce((total, expense) => {
      if (expense.lender === userData.userId)
        return total + Number(expense.amount);
      else if (expense.borrower === userData.userId && !expense?.lender)
        return total - Number(expense.amount);
      else if (expense.borrower === userData.userId)
        return total - Number(expense.amount);
      else return totalAmount;
    }, 0);

    setTotalAmount(totalExpenses);
    const { friendsExpensesConverted, selfExpense } =
      convertExpenseData(expenses);
    setTotalFriendExpense(friendsExpensesConverted);
    setTotalSelfExpense(selfExpense);
  }, [expenses]);

  return (
    <div className='expense-list-container'>
      <div className='expense-list-header'>Total Expenses {totalAmount}</div>
      <br />
      {totalFriendExpense &&
        (Object.keys(totalFriendExpense).length > 0 ? (
          <>
            <div>Friends Expenses</div>
            {Object.keys(totalFriendExpense).map((userId) => (
              <div key={userId}>
                <>
                  <div>
                    <span>{friendsData?.[userId]?.name || ''}</span>
                  </div>
                  <div>
                    <span>Expense</span>{' '}
                    <span>{totalFriendExpense[userId]}</span>
                  </div>
                  <br />
                </>
              </div>
            ))}
          </>
        ) : (
          <div>No Friend Expenses found</div>
        ))}
      {totalSelfExpense !== null && (
        <>
          <div>Self Expense</div>
          <div>
            <span>{userData?.username || ''}</span>
          </div>
          <div>
            <span>Expense</span> <span>{totalSelfExpense}</span>
          </div>
          <br />
        </>
      )}
    </div>
  );
}
