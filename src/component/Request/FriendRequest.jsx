import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../controller/Context';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function FriendRequest() {
  const [loading, setLoading] = useState(false);
  const [receivedRequest, setReceivedRequest] = useState([]);
  const userData = useContext(UserContext);
  console.log(userData, 'userData');

  const getReceivedRequest = async () => {
    setLoading(true);
    console.log(userData);
    try {
      const response = await fetch(
        `${backendUrl}/friend-requests?currentUser=${userData.userId}`
      );
      if (response.status !== 200)
        throw new Error('Error while getting requested list');
      const data = await response.json();
      const requests = data?.requests || [];

      setReceivedRequest(requests);
    } catch (error) {
      console.log(error, 'error...');
    }
    setLoading(false);
  };
  useEffect(() => {
    getReceivedRequest();
  }, []);

  const rejectFriendRequest = async (friendId) => {
    try {
      const response = await fetch(`${backendUrl}/reject-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUser: userData.userId,
          friendId,
        }),
      });

      if (!response.ok) throw new Error('Error while rejecting friend request');

      const { request_exists } = await response.json();

      if (!request_exists) throw new Error('No request found');

      const updatedRequestList = receivedRequest.filter(
        (request) => request.user_id !== friendId
      );

      setReceivedRequest(updatedRequestList);
    } catch (error) {
      console.log(error, 'Error');
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {
      const response = await fetch(`${backendUrl}/accept-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUser: userData.userId,
          friendId,
        }),
      });

      if (!response.ok) throw new Error('Error while accepting friend request');

      const { request_exists } = await response.json();
      console.log(request_exists);

      if (!request_exists) throw new Error('No request found');

      const updatedRequestList = receivedRequest.filter(
        (request) => request.user_id !== friendId
      );

      console.log(updatedRequestList, 'updatting');

      setReceivedRequest(updatedRequestList);
    } catch (error) {
      console.log(error, 'Error');
    }
  };

  console.log('requested list');
  return (
    <>
      {loading ? (
        <div>loading</div>
      ) : receivedRequest.length === 0 ? (
        <div>No request found</div>
      ) : (
        receivedRequest.map((user) => (
          <div key={user.user_id}>
            <div>{user?.name || ''}</div>
            <div>requested</div>
            <button onClick={() => acceptFriendRequest(user.user_id)}>
              Accept Request
            </button>
            <button onClick={() => rejectFriendRequest(user.user_id)}>
              Reject request
            </button>
          </div>
        ))
      )}
    </>
  );
}
//added to whom
//amount
//added date
//created date
//updated date

//lender
//borrower
//expense_date
//added_by
//created_at
//updated_at
// CREATE TABLE expense_table(lender BIGINT REFERENCES user_table(user_id), borrower BIGINT REFERENCES user_table(user_id), expense_date TIMESTAMPTZ NOT NULL, added_by BIGINT REFERENCES user_table(user_id), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);