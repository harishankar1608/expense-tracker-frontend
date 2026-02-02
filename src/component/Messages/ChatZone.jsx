import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function ChatZone() {
  const {
    messages,
    setMessages,
    setConversations,
    selectedConversationId,
    conversations,
  } = useChat();

  const chatData = messages?.[selectedConversationId] || [];

  const { userId } = useAuth();

  const chatViewRef = useRef(null);
  const chatBubbleRef = useRef(new Map());

  const [readMessageIds, setReadMessageIds] = useState(new Set());
  const processedMessageIds = useRef(new Set());

  const observerRef = useRef(null);

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          //accumulate the current set of message ids in the scroll

          if (processedMessageIds.current.has(entry.target.dataset.messageId))
            return;

          processedMessageIds.current.add(entry.target.dataset.messageId);

          setReadMessageIds((prevValue) => {
            const newSet = new Set(prevValue);
            newSet.add(entry.target.dataset.messageId);
            return newSet;
          });

          observerRef.current.unobserve(entry.target);
        });
      },
      {
        root: chatViewRef.current,
        threshold: 1.0,
      }
    );
  }, []);

  const markAsRead = async (messageIds) => {
    try {
      const response = await fetch(`${backendUrl}/read-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messageIds, userId }),
      });

      if (!response.ok) throw new Error("Error while creating read messages");
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const updateUnreadState = (messageIds) => {
    const messageIdSet = new Set(messageIds);
    let unReadCount = 0;

    setMessages((prevValue) => {
      const newValue = { ...prevValue };
      const conversationMessages = newValue[selectedConversationId];

      const updatedMessages = conversationMessages.map((message) => {
        const updatedMessage = {
          ...message,
          unRead: messageIdSet.has(message.id) ? false : message.unRead,
        };

        if (updatedMessage.unRead && updatedMessage.senderId !== userId)
          unReadCount++;
        return updatedMessage;
      });

      newValue[selectedConversationId] = updatedMessages;
      return newValue;
    });

    setConversations((prevValue) =>
      prevValue.map((conversation) => {
        if (conversation.conversationId === selectedConversationId)
          conversation.unReads = unReadCount;

        return conversation;
      })
    );
  };

  useEffect(() => {
    if (readMessageIds.size === 0) return;

    clearTimeout(timeoutId);

    const timeout = setTimeout(() => {
      const messageIds = Array.from(readMessageIds);
      markAsRead(messageIds);
      updateUnreadState(messageIds);
      setReadMessageIds(new Set());
    }, 500);

    setTimeoutId(timeout);
  }, [readMessageIds]);

  return (
    <div className="messages-chat-zone-container" ref={chatViewRef}>
      {chatData.map((chat) => (
        <div
          // ref={chatViewRef}
          ref={(element) => {
            if (!observerRef.current) return;
            // if (!element) return;
            if (element) {
              if (
                chat.unRead &&
                !chatBubbleRef.current.has(chat.id) &&
                chat.senderId !== userId
              ) {
                chatBubbleRef.current.set(chat.id, element);
                observerRef.current.observe(element);
              }
            } else {
              if (chatBubbleRef.current.has(chat.id))
                observerRef.current.unobserve(
                  chatBubbleRef.current.get(chat.id)
                );

              chatBubbleRef.current.delete(chat.id);
            }
          }}
          className={`messages-chat-bubble-container ${
            chat.senderId === userId ? "sent" : ""
          }`}
          data-message-id={chat.id}
          key={chat.id}
        >
          <span className="messages-chat-bubble-content">{chat.content}</span>
          <div
            className={`messages-chat-bubble-arrow ${
              chat.senderId === userId ? "sent" : ""
            }`}
          ></div>
        </div>
      ))}
    </div>
  );
}
// id, message_id, user_id, conversation_id, created_at, updated_at
