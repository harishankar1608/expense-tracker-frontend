import { useContext, useState } from 'react';
import { UserContext } from './Context';
import FriendList from '../component/AddExpense/FriendList';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function AddExpense() {
  const userData = useContext(UserContext);
  const [error, setError] = useState('');
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [email, setEmail] = useState('');
  const [friendsData, setFriendsData] = useState([]);

  const [selectedFriend, setSelectedFriend] = useState(null);

  const [expenseData, setExpenseData] = useState({
    expenseDate: '',
    expenseType: 'self',
    expenseAmount: '',
    expenseCategory: 'food',
    expenseDescription: '',
  });

  const currentDate = new Date().toLocaleDateString('en-CA');
  console.log(currentDate, 'current date');
  const findFriendsWithEmail = async (emailEntered) => {
    try {
      const response = await fetch(
        `${backendUrl}/find-friends?currentUser=${userData.userId}&email=${emailEntered}`
      );
      if (!response.ok) throw new Error('Error while fetching friends');

      const { friends } = await response.json();
      setFriendsData(friends);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleDebounce = (event) => {
    timeoutIds.forEach((id) => window.clearTimeout(id));
    setTimeoutIds([]);
    setEmail(event.target.value);
    const timeoutId = setTimeout(() => {
      findFriendsWithEmail(event.target.value);
    }, 600);

    setTimeoutIds((prevValue) => [...prevValue, timeoutId]);
  };

  const handleSubmit = async () => {
    /**
     * expenseDate - optional
     * expenseType - required
     * expenseAmount - required
     * expenseCategory - optional
     * expenseDescription - optional
     */

    if (!expenseData.expenseAmount || isNaN(Number(expenseData.expenseAmount)))
      return setError('Please enter an amount to add expense');

    if (expenseData.expenseType !== 'self' && !selectedFriend)
      return setError('Please select a friend to add expense');
    console.log(expenseData, 'expensedata...');
    try {
      const response = await fetch(`${backendUrl}/add-expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expenseType: expenseData.expenseType,
          expenseAmount: expenseData.expenseAmount,
          expenseDescription: expenseData.expenseDescription,
          expenseCategory: expenseData.expenseCategory,
          expenseDate: expenseData.expenseDate || new Date(),
          friendId: selectedFriend?.user_id || '',
          currentUser: userData.userId,
        }),
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleExpenseDataChange = (event, type) => {
    setExpenseData((prevValue) => ({
      ...prevValue,
      [type]: event.target.value,
    }));
  };

  console.log(expenseData, 'firneds data');
  return (
    <>
      {selectedFriend ? (
        <div>
          <div>{selectedFriend.user_id}</div>
          <div>{selectedFriend.name}</div>
          <div>{selectedFriend.email}</div>
        </div>
      ) : (
        <>
          <label htmlFor='search-friend'>Search for a friend</label>
          <input
            id='search-friend'
            value={email}
            onChange={handleDebounce}
            onFocus={handleDebounce}
          />
          <FriendList
            friendList={friendsData}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
          />
        </>
      )}
      <div>
        <label htmlFor='expense-amount'>Amount</label>
        <input
          id='expense-amount'
          type='number'
          value={expenseData.expenseAmount}
          onChange={(event) => handleExpenseDataChange(event, 'expenseAmount')}
        />

        <label htmlFor='expense-description'>Description</label>
        <input
          id='expense-description'
          type='text-area'
          value={expenseData.expenseDescription}
          onChange={(event) =>
            handleExpenseDataChange(event, 'expenseDescription')
          }
        />

        <label htmlFor='expense-type'>Expense Type</label>
        <select
          id='expense-type'
          value={expenseData.expenseType}
          onChange={(event) => handleExpenseDataChange(event, 'expenseType')}
        >
          <option value='lended'>Lended</option>
          <option value='borrowed'>Borrowed</option>
          <option value='self'>Self</option>
        </select>

        <label htmlFor='expense-category'>Expense Category</label>
        <select
          id='expense-category'
          value={expenseData.expenseCategory}
          onChange={(event) =>
            handleExpenseDataChange(event, 'expenseCategory')
          }
        >
          <option value='food'>Food</option>
          <option value='fuel'>Fuel</option>
          <option value='clothes'>Clothes</option>
          <option value='movie'>Movie</option>
          <option value='snacks'>Snacks</option>
        </select>

        <label htmlFor='expense-date'>Expense Date</label>
        <input
          id='expense-date'
          type='date'
          max={currentDate}
          value={expenseData.expenseDate}
          onChange={(event) => handleExpenseDataChange(event, 'expenseDate')}
        />
      </div>
      <button onClick={handleSubmit}>Add Expense</button>
    </>
  );
}
//lender
//borrower
//expense_date
//added_by
//created_at
//updated_at
