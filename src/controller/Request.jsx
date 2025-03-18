import { useState } from 'react';
import MyRequest from '../component/Request/MyRequest';
import FriendRequest from '../component/Request/FriendRequest';

export default function Request() {
  const [currentTab, setCurrentTab] = useState('friend_request');

  return (
    <>
      <div className='request-container'>
        <div className='request-tab-switch-container'>
          <div
            className={`request-tab-switch ${
              currentTab === 'friend_request' ? 'selected' : ''
            }`}
            onClick={() => setCurrentTab('friend_request')}
          >
            Friend Requests
          </div>
          <div
            className={`request-tab-switch ${
              currentTab === 'my_request' ? 'selected' : ''
            }`}
            onClick={() => setCurrentTab('my_request')}
          >
            My Requests
          </div>
        </div>
        {currentTab === 'my_request' && <MyRequest />}
        {currentTab === 'friend_request' && <FriendRequest />}
      </div>
    </>
  );
}
