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
        `${backendUrl}/get-friend-expenses?currentUser=${userData.userId}`
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
      <div className='expense-list-header'>
        <span className='font-bold'>Total Friends Expenses</span>
        <span
          className={`${totalAmount > 0 ? 'font-green' : 'font-red'} font-bold`}
        >
          {totalAmount}
        </span>
      </div>

      {totalFriendExpense &&
        (Object.keys(totalFriendExpense).length > 0 ? (
          <>
            {Object.keys(totalFriendExpense).map((userId, index) => (
              <div className='expense-list-card' key={userId}>
                <div className='expense-list-card-serial'>{index + 1}</div>
                <div className='expense-list-card-name'>
                  <span className='text-left'>
                    {friendsData?.[userId]?.name || ''}
                  </span>
                </div>
                {/* <div className='expense-list-card-cell'>
                  <span>{friendsData?.[userId]?.email || ''}</span>
                </div> */}
                <div className='expense-list-card-amount'>
                  <span
                    className={`${
                      totalFriendExpense[userId] > 0 ? 'font-green' : 'font-red'
                    } font-bold`}
                  >
                    {totalFriendExpense[userId]}
                  </span>
                </div>
                <div className='expense-list-card-continue'>
                  <img
                    className='expense-list-right-arrow'
                    src='/right-arrow-svgrepo-com.svg'
                    alt='Right arrow'
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>No Friend Expenses found</div>
        ))}
      {/* {totalSelfExpense !== null && (
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
      )} */}
    </div>
  );
}
