export const addMessageToUnread = (
  setUnreadConversations,
  conversationId,
  messageId
) => {
  setUnreadConversations((prevValue) => {
    const newValue = { ...prevValue };
    const unreads = newValue[conversationId] || new Set();
    unreads.add(messageId);
    newValue[conversationId] = unreads;
    return newValue;
  });
};
