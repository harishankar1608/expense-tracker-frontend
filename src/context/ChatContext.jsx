import { useEffect, useState, useRef, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const ChatContext = createContext("");
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const websocketUrl = `${process.env.REACT_APP_WEBSOCKET_PROTOCOL}://${process.env.REACT_APP_BACKEND_HOST}`;

export function ChatProvider({ children }) {
  const { loading, userId } = useAuth();
  const messageSocket = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const activeConversationId = useRef(null);

  const [friends, setFriends] = useState({});

  const [messages, setMessages] = useState({});

  const handleAddFriendData = ({ user_id, name, email }) => {
    setFriends((prevValue) => ({
      ...prevValue,
      [user_id]: { name, email },
    }));
  };

  const getAllConversation = async () => {
    try {
      const response = await fetch(`${backendUrl}/conversations`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error while getting conversations");

      const { conversations, friends } = await response.json();

      setConversations(conversations);
      setFriends(friends);
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const handleNewConversation = (eventData) => {
    const { conversation, friend } = eventData;

    handleAddFriendData({
      user_id: friend.userId,
      name: friend.name,
      email: friend.email,
    });

    setConversations((prevValue) => [conversation, ...prevValue]);
  };

  const getConversationUnreadCount = async (conversationId) => {
    try {
      const response = await fetch(
        `${backendUrl}/conversation-unreads?conversationId=${conversationId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error("Error while getting conversation unreads");

      const { unReads } = await response.json();

      return unReads;
    } catch (error) {
      console.log(error, "Error");
    }
    return 0;
  };

  const handleDeliverMessage = async (eventData) => {
    // conversationId, content, type, edited, isDeleted, senderId, clientMessageId, sentAt

    let unReadCount = 0;
    if (messages?.[eventData.conversationId]) {
      //if the conversation is alread cached in state(already viewed by user)
      unReadCount =
        messages[eventData.conversationId].reduce((acc, message) => {
          if (message.unRead) return (acc += 1);
          return acc;
        }, 0) + 1;
      setMessages((prevValue) => {
        let newMessages = { ...prevValue };
        newMessages[eventData.conversationId] = [
          ...newMessages[eventData.conversationId],
          eventData,
        ];
        return newMessages;
      });
    } else {
      //if the conversation is not already viewed by the user yet
      unReadCount = await getConversationUnreadCount(eventData.conversationId);
    }

    setConversations((prevValue) => {
      const updatedConversation = prevValue.map((conversation) => {
        if (conversation.conversationId === eventData.conversationId) {
          conversation.lastMessage = {
            content: eventData.content,
            sender_id: eventData.senderId,
            type: eventData.type,
          };
          conversation.unReads = unReadCount;
        }

        return conversation;
      });
      return updatedConversation;
    });

    // setUnreadMessages((prevValue) => prevValue + 1);
  };

  useEffect(() => {
    console.log(loading, userId, "LOADING AND USER ID");
    if (loading) return;

    console.log("passed loading ");
    if (!userId) return;
    console.log("passed userid");

    getAllConversation();

    const ws = new WebSocket(`${websocketUrl}/messages`);

    ws.onmessage = (rawEvent) => {
      const eventString = rawEvent.data.toString();
      const eventData = JSON.parse(eventString);
      switch (eventData.requestType) {
        case "new_conversation":
          handleNewConversation(eventData.data);
          break;
        case "deliver_message":
          handleDeliverMessage(eventData.data);
          break;
      }
    };

    messageSocket.current = ws;

    return () => {
      ws.close();
    };
  }, [loading, userId]);

  useEffect(() => {
    //recalculate total unread count
    const totalUnreads = conversations.reduce((total, conversation) => {
      total += conversation?.unReads || 0;
      return total;
    }, 0);

    setUnreadMessages(totalUnreads);
  }, [conversations]);

  useEffect(() => {
    activeConversationId.current = selectedConversationId;
  }, [selectedConversationId]);

  return (
    <ChatContext.Provider
      value={{
        unreadMessages,
        messages,
        setMessages,
        friends,
        handleAddFriendData,
        selectedConversationId,
        setSelectedConversationId,
        conversations,
        setConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
