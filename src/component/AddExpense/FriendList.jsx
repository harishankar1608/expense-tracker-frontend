export default function FriendList(props) {
  const { friendList, setSelectedFriend } = props;

  console.log(friendList, "friend list");
  const selectFriend = (friend) => {
    console.log(friend, "POPUPFRIEND");
    setSelectedFriend(friend);
  };

  return (
    <div className="friend-list-container">
      {friendList.map((friend, index) => (
        <div
          onClick={() => selectFriend(friend)}
          className={`friend-list-name-container`}
          key={friend.user_id}
        >
          <span>{friend.name}</span>
          <div>{friend.email}</div>
        </div>
      ))}
    </div>
  );
}
