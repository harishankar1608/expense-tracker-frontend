import { useContext, useState } from 'react';
import { NavigationBar } from './NavigationBar';
import ExpenseList from './ExpenseList';
import { UserContext } from './Context';
import AddNewExpense from '../component/AddExpense/AddNewExpense';
import Request from './Request';
import Spendings from './Spendings';

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState(1);
  const userContext = useContext(UserContext);
  const { username } = userContext;

  return (
    <>
      <div className='gray-background dashboard-container'>
        <NavigationBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className='expense-list-header-mobile'>
          <span>Hello {username.split(' ')?.[0] || ''}!</span>
        </div>
        {currentTab === 1 && <ExpenseList />}
        {currentTab === 2 && <Spendings />}
        {/* {currentTab === 2 && <AddNewExpense type='friends' />} */}
        {currentTab === 3 && <Request />}
      </div>
    </>
  );
}
