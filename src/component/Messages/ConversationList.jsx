export function ConversationList(props) {
  const {
    conversations,
    friends,
    selectedConversationId,
    handleSelectConversation,
  } = props;
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
            {conversation?.unReads > 0 && (
              <div className="message-conversation-unreads">
                {conversation?.unReads}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
