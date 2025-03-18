import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../controller/Context';
import AddFriend from './AddFriend';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function MyRequest() {
  const [loading, setLoading] = useState(false);
  const [requestedList, setRequestedList] = useState([]);
  const userData = useContext(UserContext);

  const getRequestedList = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/requested-list?currentUser=${userData.userId}`
      );
      if (response.status !== 200)
        throw new Error('Error while getting requested list');
      const data = await response.json();
      const requests = data?.requests || [];

      setRequestedList(requests);
    } catch (error) {
      console.log(error, 'error...');
    }
    setLoading(false);
  };
  useEffect(() => {
    getRequestedList();
  }, []);

  const cancelFriendRequest = async (friendId) => {
    try {
      const response = await fetch(`${backendUrl}/cancel-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUser: userData.userId,
          friendId,
        }),
      });

      if (!response.ok)
        throw new Error('Error while cancelling friend request');

      const { request_exists } = await response.json();

      if (!request_exists) throw new Error('No request found');

      const updatedRequestList = requestedList.filter(
        (request) => request.user_id !== friendId
      );

      setRequestedList(updatedRequestList);
    } catch (error) {
      console.log(error, 'Error');
    }
  };

  return (
    <>
      <div className='myrequest-container'>
        {loading ? (
          <div>loading</div>
        ) : requestedList.length === 0 ? (
          <div>No request found</div>
        ) : (
          <div className='myrequest-list-container'>
            {requestedList.map((user, index) => (
              <div className='myrequest-list'>
                <div className='myrequest-name-container'>
                  <div className='myrequest-email-tooltip'>
                    <span>{user?.name || ''}</span>
                    <div className='email-tooltip'>{user?.email || ''}</div>
                    <div className='email-tooltip-pointer'></div>
                  </div>
                  <img
                    className='myrequest-info-icon'
                    src='/info-icon.svg'
                    alt='info'
                  />
                </div>
                <div className='myrequest-email'>{user?.email || ''}</div>
                <button
                  className='myrequest-cancel-button'
                  onClick={() => cancelFriendRequest(user.user_id)}
                >
                  Cancel request
                </button>
              </div>
            ))}
          </div>
        )}

        <AddFriend />
      </div>
    </>
  );
}
