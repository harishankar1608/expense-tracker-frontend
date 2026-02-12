import { useEffect, useState, useRef, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { addMessageToUnread } from "../utils/messages";

const ChatContext = createContext("");
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const websocketUrl = `${process.env.REACT_APP_WEBSOCKET_PROTOCOL}://${process.env.REACT_APP_BACKEND_HOST}`;

export function ChatProvider({ children }) {
  const { loading, userId } = useAuth();
  const messageSocket = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [unreadConversations, setUnreadConversations] = useState({});

  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const activeConversationId = useRef(null);

  const [friends, setFriends] = useState({});

  const [messages, setMessages] = useState({});

  const existingMessagesRef = useRef(new Set());

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

      const { conversations, friends, unReads } = await response.json();

      setConversations(conversations);
      setFriends(friends);

      Object.keys(unReads).forEach((conversationId) => {
        unReads[conversationId] = new Set(unReads?.[conversationId] ?? []);
      });
      setUnreadConversations(unReads);
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const handleNewConversation = (eventData) => {
    const { conversation, friend, messageId } = eventData;
    console.log(eventData);

    handleAddFriendData({
      user_id: friend.userId,
      name: friend.name,
      email: friend.email,
    });

    addMessageToUnread(
      setUnreadConversations,
      conversation.conversationId,
      messageId
    );

    setConversations((prevValue) => [conversation, ...prevValue]);
  };

  console.log(conversations, "conversations");
  const handleDeliverMessage = async (eventData) => {
    // conversationId, content, type, edited, isDeleted, senderId, clientMessageId, sentAt

    addMessageToUnread(
      setUnreadConversations,
      eventData.conversationId,
      eventData.id
    );

    if (existingMessagesRef.current.has(eventData.conversationId)) {
      //if the conversation is alread cached in state(already viewed by user)
      setMessages((prevValue) => {
        let newMessages = { ...prevValue };
        newMessages[eventData.conversationId] = [
          ...newMessages[eventData.conversationId],
          eventData,
        ];

        return newMessages;
      });
    }

    setConversations((prevValue) => {
      const updatedConversation = prevValue.map((conversation) => {
        if (conversation.conversationId === eventData.conversationId) {
          conversation.lastMessage = {
            content: eventData.content,
            sender_id: eventData.senderId,
            type: eventData.type,
          };
        }

        return conversation;
      });
      return updatedConversation;
    });
  };

  useEffect(() => {
    if (loading) return;

    if (!userId) return;

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
        default:
          console.log("Unknown Event");
      }
    };

    messageSocket.current = ws;

    return () => {
      ws.close();
    };
  }, [loading, userId]);

  useEffect(() => {
    const totalUnreads = Object.keys(unreadConversations).reduce(
      (acc, conversationId) =>
        (acc += unreadConversations[conversationId]?.size || 0),
      0
    );
    setUnreadMessages(totalUnreads);
  }, [unreadConversations]);

  useEffect(() => {
    activeConversationId.current = selectedConversationId;
  }, [selectedConversationId]);

  return (
    <ChatContext.Provider
      value={{
        unreadMessages,
        unreadConversations,
        setUnreadConversations,
        messages,
        setMessages,
        existingMessagesRef,
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
