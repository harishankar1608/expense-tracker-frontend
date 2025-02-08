export default function FriendList(props) {
  const { friendList, setSelectedFriend } = props;

  const selectFriend = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <div className='absolute name-suggestion'>
      {friendList.map((friend) => (
        <div key={friend.user_id}>
          <div>{friend.name}</div>
          <div>{friend.email}</div>
          <button onClick={() => selectFriend(friend)}>Select</button>
        </div>
      ))}
    </div>
  );
}
