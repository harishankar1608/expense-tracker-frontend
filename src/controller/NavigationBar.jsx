export const NavigationBar = (props) => {
  const { setCurrentTab } = props;
  return (
    <div className='nav-bar-icon-container'>
      <div onClick={() => setCurrentTab(1)}>
        <img
          className='nav-bar-icon'
          src='expense-list.svg'
          alt='expense list icon'
        />
      </div>
      <div onClick={() => setCurrentTab(2)}>
        <img
          className='nav-bar-icon'
          src='expense-list.svg'
          alt='expense list icon'
        />
      </div>
      <div onClick={() => setCurrentTab(3)}>
        <img
          className='nav-bar-icon'
          src='expense-list.svg'
          alt='expense list icon'
        />
      </div>
      <div onClick={() => setCurrentTab(4)}>
        <img
          className='nav-bar-icon'
          src='expense-list.svg'
          alt='expense list icon'
        />
      </div>
      <div onClick={() => setCurrentTab(5)}>
        <img
          className='nav-bar-icon'
          src='expense-list.svg'
          alt='expense list icon'
        />
      </div>
    </div>
  );
};
