import { useState } from "react";
import SearchUsers from "../FindFriends/SearchUsers";
import { useAuth } from "../../context/AuthContext.jsx";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function AddFriend() {
  const { userId } = useAuth();

  const [popupOpen, setPopupOpen] = useState(false);

  const openAddFriendPopup = () => {
    setPopupOpen(true);
  };

  const sendFriendRequest = async (friendId) => {
    // if (loading) return;

    // setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/send-friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
          friendId,
        }),
      });
      if (!response.ok) throw new Error("Error while sending friend request");
      setTimeout(() => {
        setPopupOpen(false);
      }, 500);
    } catch (error) {
      console.log(error, "error");
    }
    // setLoading(false);
  };
  return (
    <>
      <div onClick={openAddFriendPopup} className="add-friend-button-container">
        <img src="/add-friend.svg" className="add-friend-icon" />
        <span>Add Friend</span>
      </div>
      {popupOpen && (
        <div className="add-friend-popup-overlay">
          <div className="add-friend-popup">
            <div className="add-friend-popup-container">
              <label for="add-friend-email" className="add-friend-email-label">
                Please enter an email to search
              </label>
              <SearchUsers
                handleSubmit={sendFriendRequest}
                buttonContent={"Send Request"}
              />
            </div>
            <span
              onClick={() => setPopupOpen(false)}
              className="add-friend-popup-close"
            >
              x
            </span>
          </div>
        </div>
      )}
    </>
  );
}
