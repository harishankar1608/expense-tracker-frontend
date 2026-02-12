import { useState } from "react";

export default function UserList(props) {
  const { friendList, setFriendList, buttonContent, handleSubmit } = props;

  const [loading, setLoading] = useState(false);

  const handleUserSelect = async (friendId) => {
    if (loading) return;
    setLoading(true);
    await handleSubmit(friendId);
    //filter out the friend to whom the request was sent already

    setFriendList((friends) =>
      friends.filter((friend) => friend.user_id !== friendId)
    );

    setLoading(false);
  };

  return (
    <div className="add-friend-name-suggestion-container">
      {friendList.map((user) => (
        <div className="add-friend-name-list">
          <div className="add-friend-name-info-container">
            <div>{user.name}</div>
            <div className="add-friend-icon-container">
              <img src="/info-icon.svg" className="add-friend-name-info" />
              <div className="add-friend-email-tooltip">
                {user?.email || ""}
              </div>
              <div className="add-friend-email-tooltip-pointer"></div>
            </div>
          </div>
          {/* <div>{user.email}</div> */}
          <button
            className="add-friend-name-list-button"
            onClick={() => handleUserSelect(user.user_id)}
          >
            {buttonContent}
          </button>
        </div>
      ))}
    </div>
  );
}
