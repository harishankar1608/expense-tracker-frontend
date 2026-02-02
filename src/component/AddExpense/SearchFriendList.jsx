import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SearchFriendList(props) {
  const {
    handleSelectFriend,
    buttonContent,
    placeholder,
    includeConversation = false,
  } = props;

  const { userId } = useAuth();

  const [timeoutIds, setTimeoutIds] = useState([]);
  const [friendsData, setFriendsData] = useState([]);

  const [email, setEmail] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const selectFriend = (friend) => {
    setEmail("");
    setFriendsData([]);
    handleSelectFriend(friend);
  };

  const findFriendsWithEmail = async (emailEntered) => {
    try {
      const response = await fetch(
        `${backendUrl}/find-friends?currentUser=${userId}&email=${emailEntered}&includeConversation=${includeConversation}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Error while fetching friends");
      const { friends } = await response.json();
      setFriendsData(friends);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleDebounce = (event) => {
    timeoutIds.forEach((id) => window.clearTimeout(id));

    setTimeoutIds([]);
    setEmail(event.target.value);
    if (!event.target.value) {
      setFriendsData([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      findFriendsWithEmail(event.target.value);
    }, 600);

    setTimeoutIds((prevValue) => [...prevValue, timeoutId]);
  };

  return (
    <div className="add-expense-input-container">
      <input
        id="search-friend"
        placeholder={placeholder}
        className="search-friend-input"
        value={email}
        onChange={handleDebounce}
        onFocus={handleDebounce}
      />
      <div className="friend-list-container">
        {friendsData.map((friend, index) => (
          <div className={`friend-list-name-container`} key={friend.user_id}>
            <span>{friend.name}</span>
            <button
              onClick={() => selectFriend(friend)}
              className="select-friend-button"
            >
              {buttonContent}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
