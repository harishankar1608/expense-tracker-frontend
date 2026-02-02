import { useEffect, useState } from "react";
import ChatZone from "./ChatZone";
import { useAuth } from "../../context/AuthContext.jsx";
import { useChat } from "../../context/ChatContext.jsx";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Chat({ friendId }) {
  const { userId } = useAuth();
  const { messages, setMessages, selectedConversationId } = useChat();

  const [loading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          conversationId: selectedConversationId,
          message: messageContent,
          to: friendId,
        }),
      });

      if (!response.ok) throw new Error("Error while sending message");

      const { data } = await response.json();

      setMessages((prevValue) => ({
        ...prevValue,
        [selectedConversationId]: [
          ...(prevValue?.[selectedConversationId] || []),
          data,
        ],
      }));
      setMessageContent("");
    } catch (error) {
      console.log(error, "Error");
    }
    setLoading(false);
  };

  const handleMessageChange = (event) => {
    setMessageContent(event.target.value);
  };

  const getMessagesForConversation = async (conversationId) => {
    try {
      const response = await fetch(
        `${backendUrl}/messages?conversationId=${conversationId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("Error while getting messages for conversation");

      const { messages } = await response.json();
      setMessages((prevValue) => ({
        ...prevValue,
        [conversationId]: messages,
      }));
    } catch (error) {
      console.log(error, "Error");
    }
  };

  useEffect(() => {
    if (!messages?.[selectedConversationId])
      getMessagesForConversation(selectedConversationId);
  }, [selectedConversationId]);

  return (
    <>
      <div className="messages-chat-container">
        {/* <div className="messages-chat-title-container">
          This is fully chat container
        </div> */}
        <ChatZone />
        <div className="messages-chat-input-container">
          <input
            className="messages-chat-input"
            value={messageContent}
            onChange={handleMessageChange}
          />
          <button
            className="message-chat-send-button"
            onClick={handleSendMessage}
          >
            <img className="message-chat-send-icon" src="/send-message.svg" />
          </button>
        </div>
      </div>
    </>
  );
}
