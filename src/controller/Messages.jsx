import { useEffect, useState } from "react";
import Chat from "../component/Messages/Chat";
import SearchFriendList from "../component/AddExpense/SearchFriendList";
import { ConversationList } from "../component/Messages/ConversationList";
import { useChat } from "../context/ChatContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Messages() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const {
    messages,
    addMessage,
    selectedConversationId,
    setSelectedConversationId,
    friends,
    handleAddFriendData,
    conversations,
    setConversations,
  } = useChat();

  const handleSelectFriend = (friend) => {
    const existingConversation = conversations.find(
      (conversation) => friend.user_id === conversation.participant_id
    );

    handleAddFriendData({
      user_id: friend.user_id,
      email: friend.email,
      name: friend.name,
    });

    if (existingConversation) {
      setSelectedConversationId(existingConversation.conversation_id);
      setSelectedFriend(null);
    } else {
      setSelectedFriend(friend.user_id);
      setSelectedConversationId(null);
    }
  };

  return (
    <>
      <div className="message-container">
        <div className="messages-search-conversation-container">
          <div className="messages-input-container">
            <SearchFriendList
              handleSelectFriend={handleSelectFriend}
              buttonContent={"Chat"}
              placeholder="Search to start chatting"
            />
          </div>

          <ConversationList conversations={conversations} friends={friends} />
        </div>
        {selectedFriend || selectedConversationId ? (
          <Chat
            friendId={selectedFriend}
            conversationId={selectedConversationId}
          />
        ) : (
          <div>A very light message icon</div>
        )}
      </div>
    </>
  );
}
