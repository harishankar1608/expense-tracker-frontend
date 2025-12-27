import { useState } from "react";

export default function ChatZone(props) {
  const { chatData } = props;
  return (
    <div>
      {chatData.map((chat) => (
        <div className="">{chat.content}</div>
      ))}
    </div>
  );
}
