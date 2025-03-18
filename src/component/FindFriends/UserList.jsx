import { useContext, useState } from 'react';
import { UserContext } from '../../controller/Context';

export default function UserList(props) {
  const userData = useContext(UserContext);

  const { friendList, setFriendList } = props;

  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const sendFriendRequest = async (friendId) => {
    if (loading) return;

    setLoading(true);
    try {
      console.log(friendId, 'friendID');
      const response = await fetch(`${backendUrl}/send-friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.userId,
          friendId,
        }),
      });
      if (!response.ok) throw new Error('Error while sending friend request');

      //filter out the friend to whom the request was sent already
      setFriendList((friends) =>
        friends.filter((friend) => friend.user_id !== friendId)
      );
    } catch (error) {
      console.log(error, 'error');
    }
    setLoading(false);
  };
  console.log(friendList);
  return (
    <div className='add-friend-name-suggestion-container'>
      {friendList.map((user) => (
        <div className='add-friend-name-list'>
          <div className='add-friend-name-info-container'>
            <div>{user.name}</div>
            <div className='add-friend-icon-container'>
              <img src='/info-icon.svg' className='add-friend-name-info' />
              <div className='add-friend-email-tooltip'>
                {user?.email || ''}
              </div>
              <div className='add-friend-email-tooltip-pointer'></div>
            </div>
          </div>
          {/* <div>{user.email}</div> */}
          <button
            className='add-friend-name-list-button'
            onClick={() => sendFriendRequest(user.user_id)}
          >
            Send request
          </button>
        </div>
      ))}
    </div>
  );
}
