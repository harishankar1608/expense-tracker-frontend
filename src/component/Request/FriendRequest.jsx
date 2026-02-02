import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function FriendRequest() {
  const [loading, setLoading] = useState(false);
  const [receivedRequest, setReceivedRequest] = useState([]);
  const { userId } = useAuth();

  const getReceivedRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/friend-requests?currentUser=${userId}`,
        { method: "GET", credentials: "include" }
      );
      if (response.status !== 200)
        throw new Error("Error while getting requested list");
      const data = await response.json();
      const requests = data?.requests || [];

      setReceivedRequest(requests);
    } catch (error) {
      console.log(error, "error...");
    }
    setLoading(false);
  };
  useEffect(() => {
    getReceivedRequest();
  }, []);

  const rejectFriendRequest = async (friendId) => {
    try {
      const response = await fetch(`${backendUrl}/reject-request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentUser: userId,
          friendId,
        }),
      });

      if (!response.ok) throw new Error("Error while rejecting friend request");

      const { request_exists } = await response.json();

      if (!request_exists) throw new Error("No request found");

      const updatedRequestList = receivedRequest.filter(
        (request) => request.user_id !== friendId
      );

      setReceivedRequest(updatedRequestList);
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {
      const response = await fetch(`${backendUrl}/accept-request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentUser: userId,
          friendId,
        }),
      });

      if (!response.ok) throw new Error("Error while accepting friend request");

      const { request_exists } = await response.json();

      if (!request_exists) throw new Error("No request found");

      const updatedRequestList = receivedRequest.filter(
        (request) => request.user_id !== friendId
      );

      setReceivedRequest(updatedRequestList);
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <div className="friend-request-container">
      {loading ? (
        <div>loading</div>
      ) : receivedRequest.length === 0 ? (
        <div>No request found</div>
      ) : (
        <div className="friend-request-list-container">
          {receivedRequest.map((user) => (
            <div className="friend-request-list" key={user.user_id}>
              <div className="friend-request-name-container">
                <div className="friend-request-email-tooltip">
                  <span>{user?.name || ""}</span>
                  <div className="email-tooltip">{user?.email || ""} </div>
                  <div className="email-tooltip-pointer"></div>
                </div>
                <img
                  className="friend-request-info-icon"
                  src="/info-icon.svg"
                  alt="info"
                />
              </div>
              <div className="friend-request-email">{user?.email || ""}</div>

              <div className="friend-request-button-container">
                <button
                  className="friend-request-button friend-request-accept-button"
                  onClick={() => acceptFriendRequest(user.user_id)}
                >
                  Accept
                </button>
                <button
                  className="friend-request-button friend-request-reject-button"
                  onClick={() => rejectFriendRequest(user.user_id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
