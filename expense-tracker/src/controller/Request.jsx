import { useState } from 'react';
import MyRequest from '../component/Request/MyRequest';
import FriendRequest from '../component/Request/FriendRequest';

export default function Request() {
  const [currentTab, setCurrentTab] = useState('my_request');

  return (
    <>
      <div onClick={() => setCurrentTab('my_request')}>My Request</div>
      <div onClick={() => setCurrentTab('friend_request')}>Friend Requests</div>
      {currentTab === 'my_request' && <MyRequest />}
      {currentTab === 'friend_request' && <FriendRequest />}
    </>
  );
}
