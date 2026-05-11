import Chat from "../component/Messages/Chat";
import SearchFriendList from "../component/AddExpense/SearchFriendList";
import { ConversationList } from "../component/Messages/ConversationList";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Messages() {
  const {
    selectedConversationId,
    setSelectedConversationId,
    handleAddFriendData,
    conversations,
    setConversations,
  } = useChat();

  const { userId } = useAuth();

  const startConversation = async (friendId) => {
    try {
      const response = await fetch(`${backendUrl}/start-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          friendId,
        }),
      });
      if (!response.ok) throw new Error("Error while creating conversation");

      const { data } = await response.json();
      return { status: true, data };
    } catch (error) {
      console.log("error", Error);
      return { status: false, data: null };
    }
  };

  const handleSelectFriend = async (friend) => {
    //Find whether any existing conversation matches
    const existingConversation = conversations.find(
      (conversation) => friend.conversation_id === conversation.conversationId
    );

    handleAddFriendData({
      user_id: friend.user_id,
      email: friend.email,
      name: friend.name,
    });

    if (existingConversation) {
      setSelectedConversationId(existingConversation.conversationId);
    } else {
      const { status, data } = await startConversation(friend.user_id);
      if (status) {
        setConversations((prevValue) => [data.conversation, ...prevValue]);
        setSelectedConversationId(data.conversation.conversationId);
      }
    }
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const handleUnselectConversation = () => {
    setSelectedConversationId(null);
  };

  return (
    <>
      <div className="message-container">
        <div
          className={`messages-search-conversation-container ${
            selectedConversationId ? "hidden" : ""
          }`}
        >
          <div className="messages-input-container">
            <SearchFriendList
              handleSelectFriend={handleSelectFriend}
              buttonContent={"Chat"}
              placeholder="Search to start chatting"
              includeConversation={true}
            />
          </div>

          <ConversationList
            handleSelectConversation={handleSelectConversation}
          />
        </div>
        {selectedConversationId ? (
          <Chat handleUnselectConversation={handleUnselectConversation} />
        ) : (
          <div>A very light message icon</div>
        )}
      </div>
    </>
  );
}
