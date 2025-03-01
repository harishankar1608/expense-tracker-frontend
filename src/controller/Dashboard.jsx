import { useState } from 'react';
import { NavigationBar } from './NavigationBar';
import ExpenseList from './ExpenseList';

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState(1);

  return (
    <>
      <div className='gray-background dashboard-container'>
        {currentTab === 1 && <ExpenseList />}
        <NavigationBar setCurrentTab={setCurrentTab} />
      </div>
    </>
  );
}
