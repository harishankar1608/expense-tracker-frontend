import { useContext, useEffect, useState } from 'react';
import FriendList from './FriendList';
import { UserContext } from '../../controller/Context';
import Dropdown from '../helpers/Dropdown';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function AddNewExpense({ type }) {
  const userData = useContext(UserContext);
  const [error, setError] = useState('');
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [email, setEmail] = useState('');

  const [openFriendsList, setOpenFriendsList] = useState(false);
  const [friendsData, setFriendsData] = useState([]);

  const [selectedFriend, setSelectedFriend] = useState(null);

  const expenseCategoryList = ['Food', 'Snacks', 'Fuel', 'Shopping', 'Movie'];
  const [expenseCategory, setExpenseCategory] = useState('Food');

  const expenseTypeList = ['Lended', 'Borrowed'];
  const [expenseType, setExpenseType] = useState('Lended');

  const [dropdown, setDropdown] = useState(null);

  const [expenseData, setExpenseData] = useState({
    expenseDate: '',
    expenseType: 'lended',
    expenseAmount: '',
    expenseCategory: 'Food',
    expenseDescription: '',
  });

  const currentDate = new Date().toLocaleDateString('en-CA');

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
    if (!event.target.value) {
      setOpenFriendsList(false);
      setFriendsData([]);
      return;
    }
    setOpenFriendsList(true);
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

    if (type !== 'self' && !selectedFriend)
      return setError('Please select a friend to add expense');

    try {
      const response = await fetch(`${backendUrl}/add-expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expenseType: type === 'self' ? 'self' : expenseData.expenseType,
          expenseAmount: Number(expenseData.expenseAmount),
          expenseDescription: expenseData.expenseDescription,
          expenseCategory: expenseData.expenseCategory,
          expenseDate: expenseData.expenseDate || new Date(),
          friendId: selectedFriend?.user_id || '',
          currentUser: userData.userId,
        }),
      });
      if (response.status !== 200)
        throw new Error('Error while adding expense');
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

  const handleFriendSelected = () => {
    setEmail('');
    setFriendsData([]);
  };

  useEffect(() => {
    if (selectedFriend) handleFriendSelected();
  }, [selectedFriend]);

  const clearSelectedFriend = () => {
    setSelectedFriend(null);
  };

  return (
    <div className='add-expenses-container'>
      {type === 'friends' && (
        <div className='add-expense-search-friend-amount'>
          <div className='add-expense-search-friend'>
            {selectedFriend ? (
              <>
                <label>Adding For</label>
                <div>
                  <div className='add-expense-selected-friend-view'>
                    <div className='add-expense-selected-friend-name'>
                      <div>{selectedFriend.name}</div>
                      <div>{selectedFriend.email}</div>
                    </div>
                    <div
                      onClick={clearSelectedFriend}
                      className='add-expense-clear-friend'
                    >
                      x
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <label className='add-expenses-label' htmlFor='search-friend'>
                  Search for a friend
                </label>
                <div
                  className='add-expense-input-container'
                  // onBlur={() => {
                  //   setOpenFriendsList(false);
                  // }}
                >
                  <input
                    id='search-friend'
                    className='add-expense-search-friend-input'
                    value={email}
                    onChange={handleDebounce}
                    onFocus={handleDebounce}
                  />
                  {openFriendsList && friendsData.length > 0 && (
                    <FriendList
                      friendList={friendsData}
                      selectedFriend={selectedFriend}
                      setSelectedFriend={setSelectedFriend}
                    />
                  )}
                </div>
              </>
            )}
          </div>
          <div className='add-expense-amount-block'>
            <label htmlFor='expense-amount'>Amount</label>
            <input
              id='expense-amount'
              type='number'
              className='add-expense-amount-input'
              value={expenseData.expenseAmount}
              onChange={(event) =>
                handleExpenseDataChange(event, 'expenseAmount')
              }
            />
          </div>
        </div>
      )}

      <div className='add-expenses-default-items'>
        <div className='add-expenses-type-category'>
          {type === 'friends' ? (
            <div className='add-expense-type-block'>
              <>
                <label htmlFor='expense-type'>Expense Type</label>
                <div className='add-expense-input-container'>
                  <input
                    id='expense-type'
                    className='add-expense-type-input'
                    value={expenseType}
                    onChange={(event) =>
                      handleExpenseDataChange(event, 'expenseType')
                    }
                    onClick={() => setDropdown('expenseType')}
                  />
                  {dropdown === 'expenseType' && (
                    <Dropdown
                      dropdownValues={expenseTypeList}
                      selectedValue={expenseType}
                      setSelectedValue={setExpenseType}
                      setDropdown={setDropdown}
                    />
                  )}
                </div>
              </>
            </div>
          ) : (
            <div className='add-expense-amount-block'>
              <label htmlFor='expense-amount'>Amount</label>
              <input
                id='expense-amount'
                type='number'
                className='add-expense-amount-input'
                value={expenseData.expenseAmount}
                onChange={(event) =>
                  handleExpenseDataChange(event, 'expenseAmount')
                }
              />
            </div>
          )}
          <div className='add-expense-category-block'>
            <label htmlFor='expense-category'>Expense Category</label>
            <div className='add-expense-input-container'>
              <input
                id='expense-amount'
                className='add-expense-category-input'
                value={expenseCategory}
                onChange={(event) =>
                  handleExpenseDataChange(event, 'expenseCategory')
                }
                onClick={() => setDropdown('expenseCategory')}
              />
              {dropdown === 'expenseCategory' && (
                <Dropdown
                  dropdownValues={expenseCategoryList}
                  selectedValue={expenseCategory}
                  setSelectedValue={setExpenseCategory}
                  setDropdown={setDropdown}
                />
              )}
            </div>
          </div>
        </div>
        <div className='add-expense-description'>
          <div className='add-expense-description-block'>
            <label htmlFor='expense-description'>Description</label>
            <textarea
              id='expense-description'
              className='add-expense-description-input'
              type='text-area'
              value={expenseData.expenseDescription}
              onChange={(event) =>
                handleExpenseDataChange(event, 'expenseDescription')
              }
            />
          </div>
          <div className='add-expense-date-block'>
            <label htmlFor='expense-date'>Expense Date</label>
            <input
              id='expense-date'
              className='add-expense-date-input'
              type='date'
              max={currentDate}
              value={expenseData.expenseDate}
              onChange={(event) =>
                handleExpenseDataChange(event, 'expenseDate')
              }
            />
          </div>
        </div>
        {/* <div className='add-expense-category-date'>
          
        </div> */}
        <div className='add-expense-submit-block'>
          <button className='add-expense-submit-button' onClick={handleSubmit}>
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}
//lender
//borrower
//expense_date
//added_by
//created_at
//updated_at
