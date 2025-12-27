const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function ConversationList(props) {
  const { conversations, friends } = props;
  return (
    <>
      <ul className="message-conversation-list-container">
        {conversations.map((conversation) => (
          <li className="message-conversation-content">
            <div>{friends?.[conversation?.participant_id]?.name}</div>
            <div>{conversation?.last_message?.content}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
