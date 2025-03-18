import { useContext } from 'react';
import { UserContext } from './Context';

export const NavigationBar = (props) => {
  const { currentTab, setCurrentTab } = props;
  const userContext = useContext(UserContext);
  const { username } = userContext;
  return (
    <div className='nav-bar-container'>
      <div className='nav-welcome-user'>
        <span>Hello {username.split(' ')?.[0] || ''}!</span>
      </div>
      <div className='nav-bar-icon-container font-bold'>
        <div
          className={`nav-icon-content ${
            currentTab === 1 ? 'nav-bar-selected' : ''
          }`}
          onClick={() => setCurrentTab(1)}
        >
          <img
            className='nav-bar-icon'
            src='expense-list-icon.svg'
            alt='expense list icon'
          />

          <span>Expenses</span>
        </div>

        <div
          className={`nav-icon-content ${
            currentTab === 2 ? 'nav-bar-selected' : ''
          }`}
          onClick={() => setCurrentTab(2)}
        >
          <img
            className='nav-bar-icon'
            src='expense-list-icon.svg'
            alt='expense list icon'
          />
          <span>Expenses</span>
        </div>
        <div
          className={`nav-icon-content ${
            currentTab === 3 ? 'nav-bar-selected' : ''
          }`}
          onClick={() => setCurrentTab(3)}
        >
          <img
            className='nav-bar-icon'
            src='friend-request-icon.svg'
            alt='request icon'
          />
          <span>Requests</span>
        </div>
        <div
          className={`nav-icon-content ${
            currentTab === 4 ? 'nav-bar-selected' : ''
          }`}
          onClick={() => setCurrentTab(4)}
        >
          <img
            className='nav-bar-icon'
            src='expense-list-icon.svg'
            alt='expense list icon'
          />
          <span>Expenses</span>
        </div>
        <div
          className={`nav-icon-content ${
            currentTab === 5 ? 'nav-bar-selected' : ''
          }`}
          onClick={() => setCurrentTab(5)}
        >
          <img
            className='nav-bar-icon'
            src='expense-list-icon.svg'
            alt='expense list icon'
          />
          <span>Expenses</span>
        </div>
      </div>
    </div>
  );
};
