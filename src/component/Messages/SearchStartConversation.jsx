import SearchFriendList from "../AddExpense/SearchFriendList";
import { useState } from "react";
import { useEffect } from "react";
import { ConversationList } from "./ConversationList";
import { useAuth } from "../../context/AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function SearchStartConversation() {
  const { userId } = useAuth();
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleStartConversation = async (friendId) => {
    try {
      const response = await fetch(`${backendUrl}/start-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({ friendId, userId }),
      });

      if (!response.ok)
        throw new Error("Error Occured in start conversation api");

      const { conversation } = await response.json();
      //update the conversation object to the parent state
    } catch (error) {
      console.log(error, "ERROR");
    }
  };

  useEffect(() => {
    if (!selectedFriend) return;

    //check if a chat already exists in the frontend and navigate the user to existing user

    handleStartConversation(selectedFriend.user_id);
  }, [selectedFriend]);
  return (
    <>
      <div className="messages-search-conversation-container">
        <div className="messages-input-container">
          <SearchFriendList
            setSelectedFriend={setSelectedFriend}
            buttonContent={"Chat"}
            placeholder="Search to start chatting"
          />
        </div>
        <ConversationList />
      </div>
    </>
  );
}
