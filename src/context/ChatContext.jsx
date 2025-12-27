import { createContext } from "react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useAuth } from "./AuthContext";
import { useContext } from "react";
import { CONVERSATION_TYPE } from "../enum/message";

const ChatContext = createContext("");
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const websocketUrl = `${process.env.REACT_APP_WEBSOCKET_PROTOCOL}://${process.env.REACT_APP_BACKEND_HOST}`;

export function ChatProvider({ children }) {
  const { loading, userId } = useAuth();
  const messageSocket = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [friends, setFriends] = useState({});

  const [messages, setMessages] = useState([]);

  const sendMessage = ({ to, message, messageId, conversationId }) => {
    console.log(to, message, messageId, conversationId, "SEND MESSAGE INSIDE");
    console.log(conversations, "CONVERSATION");
    let a = userId,
      b = to;
    if (a > b) [a, b] = [b, a];
    const tempId = `${CONVERSATION_TYPE.DM}-${a}-${b}`;

    //make entry to conversation table if the id does not exist
    const conversation = {
      participant_id: to,
      type: CONVERSATION_TYPE.DM,
      last_message: {
        content: message,
      },
      unread: 0,
      conversationId: conversationId,
      tempId: tempId,
    };

    setConversations((prevValue) => {
      let conversationFound = false;
      const updatedData = prevValue.map((conversation) => {
        if (conversation.conversationId === conversationId) {
          conversationFound = true;
          return {
            ...conversation,
            last_message: {
              content: message,
            },
          };
        }
        return conversation;
      });

      if (conversationFound) return updatedData;

      return [...prevValue, conversation];
    });

    const messageObj = {
      content: message,
      messageId,
      conversationId,
    };

    setMessages((prevValue) => [...prevValue, messageObj]);
    //make entry to message table
    try {
      if (messageSocket.current) {
        messageSocket.current.send(
          JSON.stringify({
            requestType: "send_message",
            data: {
              to,
              message,
              conversationId,
              messageId,
              tempId,
            },
          })
        );
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const addMessage = (message) => {
    if (message.conversationId !== selectedConversationId) return;
    setMessages((prevValue) => [...prevValue, message]);
  };

  const handleAddFriendData = ({ user_id, name, email }) => {
    setFriends((prevValue) => ({
      ...prevValue,
      [user_id]: { name, email },
    }));
  };

  const getAllConversation = async () => {
    try {
      const response = await fetch(`${backendUrl}/conversations`);
      if (!response.ok) throw new Error("Error while getting conversations");

      const { conversations, friends } = await response.json();

      setConversations(conversations);
      setFriends(friends);
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const handleConversationCreation = (eventData) => {
    const { tempId, messageId, conversationId } = eventData;

    setConversations((prevValue) => {
      return prevValue.map((conversation) => {
        if (conversation.tempId === tempId) {
          conversation.conversationId = conversationId;
        }
        return conversation;
      });
    });

    setMessages((prevValue) => {
      return prevValue.map((message) => {
        if (message.messageId === messageId) {
          message.conversationId = conversationId;
        }
        return message;
      });
    });

    if (!selectedConversationId) setSelectedConversationId(conversationId);
  };

  useEffect(() => {
    if (loading) return;

    if (!userId) return;

    getAllConversation();

    const ws = new WebSocket(`${websocketUrl}/messages`);

    ws.onmessage = (rawEvent) => {
      console.log(rawEvent, "rawEVent");
      const eventString = rawEvent.data.toString();
      const eventData = JSON.parse(eventString);
      console.log(eventData, "EVENT DATA");
      switch (eventData.requestType) {
        // case "send_message_confirmation":
        //   handleMessageConfirmation();
        //   break;
        case "conversation_creation_confirmation":
          handleConversationCreation(eventData.data);
          break;
        // case "send_message_failure":
        //   handleMessageFailure();
        //   break;
        // case "deliver_message":
        //   handleDeliverMessage();
        //   break;
      }
      // setUnreadMessages((prevValue) => prevValue + 1);
    };

    messageSocket.current = ws;

    return () => {
      ws.close();
    };
  }, [loading]);

  console.log(conversations, friends, "Conversations");
  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        unreadMessages,
        messages,
        addMessage,
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
