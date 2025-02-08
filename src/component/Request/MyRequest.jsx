import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../controller/Context';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function MyRequest() {
  const [loading, setLoading] = useState(false);
  const [requestedList, setRequestedList] = useState([]);
  const userData = useContext(UserContext);
  const getRequestedList = async () => {
    setLoading(true);
    console.log(userData);
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

  console.log('requested list');
  return (
    <>
      {loading ? (
        <div>loading</div>
      ) : requestedList.length === 0 ? (
        <div>No request found</div>
      ) : (
        requestedList.map((user) => (
          <div>
            <div>{user?.name || ''}</div>
            <div>requested</div>
            <button onClick={() => cancelFriendRequest(user.user_id)}>
              Cancel request
            </button>
          </div>
        ))
      )}
    </>
  );
}
