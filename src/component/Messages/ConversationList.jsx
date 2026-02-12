import { useChat } from "../../context/ChatContext";

export function ConversationList(props) {
  const { handleSelectConversation } = props;
  const {
    conversations,
    friends,
    selectedConversationId,
    unreadConversations,
  } = useChat();

  return (
    <>
      <ul className="message-conversation-list-container">
        {conversations.map((conversation) => (
          <li
            key={conversation.conversationId}
            className={`message-conversation-content ${
              selectedConversationId === conversation.conversationId
                ? "selected-conversation"
                : ""
            }`}
            onClick={() =>
              handleSelectConversation(conversation.conversationId)
            }
          >
            <div>{friends?.[conversation?.participantId]?.name}</div>
            <div>{conversation?.lastMessage?.content}</div>
            {unreadConversations?.[conversation.conversationId]?.size > 0 && (
              <div className="message-conversation-unreads">
                {unreadConversations?.[conversation.conversationId]?.size}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
