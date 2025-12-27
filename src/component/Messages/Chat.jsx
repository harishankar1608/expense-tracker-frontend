import { useState } from "react";
import ChatZone from "./ChatZone";
import { useAuth } from "../../context/AuthContext.jsx";
import { useChat } from "../../context/ChatContext.jsx";

export default function Chat({ friendId, conversationId }) {
  const { userId } = useAuth();
  const [chatTitle, setChatTitle] = useState("");
  const { messages, sendMessage } = useChat();

  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = () => {
    const messageData = {
      userId,
      conversationId,
      message: messageContent,
      messageId: crypto.randomUUID(),
      to: friendId,
    };
    sendMessage(messageData);
  };

  const handleMessageChange = (event) => {
    setMessageContent(event.target.value);
  };

  return (
    <div className="message-chat-container">
      <div>This is fully chat container</div>
      {/* <ChatZone chatData={messages} /> */}
      <div>
        <input onChange={handleMessageChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
