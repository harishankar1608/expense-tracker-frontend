import { useContext } from 'react';
import { UserContext } from '../../controller/Context';

export default function UserList(props) {
  const userData = useContext(UserContext);

  const { friendList } = props;

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const sendFriendRequest = async (friendId) => {
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
    } catch (error) {
      console.log(error, 'error');
    }
  };
  console.log(friendList);
  return (
    <div className='absolute name-suggestion'>
      {friendList.map((user) => (
        <>
          <div>{user.name}</div>
          <div>{user.email}</div>
          <button onClick={() => sendFriendRequest(user.user_id)}>
            Send request
          </button>
        </>
      ))}
    </div>
  );
}
