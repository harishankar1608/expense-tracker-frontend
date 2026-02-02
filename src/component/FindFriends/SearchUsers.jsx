import { useState } from "react";
import UserList from "./UserList";
import { useAuth } from "../../context/AuthContext";

export default function SearchUsers(props) {
  const { userId } = useAuth();
  const { handleSubmit, buttonContent } = props;

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [timeoutIds, setTimeoutIds] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const findUserWithEmail = async () => {
    if (email === "")
      return setError("Please enter an email id to find your friend");

    try {
      //pass the user id to neglect the current user to be found
      const response = await fetch(
        `${backendUrl}/find-users?email=${email}&current_user=${userId}`,
        { method: "GET", credentials: "include" }
      );

      if (response.status !== 200) throw new Error("Error while finding users");
      const data = await response.json();
      const results = data?.results || [];

      if (results.length === 0) return setError("No matching results");
      setSearchResults(results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDebounce = (event) => {
    timeoutIds.forEach((id) => window.clearTimeout(id));
    setTimeoutIds([]);
    setEmail(event.target.value);
    const timeoutId = setTimeout(() => {
      findUserWithEmail();
    }, 600);

    setTimeoutIds((prevValue) => [...prevValue, timeoutId]);
  };

  return (
    <>
      <input
        type="text"
        id="add-friend-email"
        name="email"
        className="add-friend-email-input"
        value={email}
        onChange={(e) => handleDebounce(e)}
      />
      <UserList
        friendList={searchResults}
        setFriendList={setSearchResults}
        buttonContent={buttonContent}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
