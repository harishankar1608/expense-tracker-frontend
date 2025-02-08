import { useContext, useState } from 'react';
import { UserContext } from './Context';
import UserList from '../component/FindFriends/UserList';

export default function FindFriends() {
  const userData = useContext(UserContext);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [timeoutIds, setTimeoutIds] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const findUserWithEmail = async () => {
    if (email === '')
      return setError('Please enter an email id to find your friend');

    try {
      //pass the user id to neglect the current user to be found
      const response = await fetch(
        `${backendUrl}/find-users?email=${email}&current_user=${userData?.userId}`
      );

      if (response.status !== 200) throw new Error('Error while finding users');
      const data = await response.json();
      const results = data?.results || [];

      if (results.length === 0) return setError('No matching results');
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

  console.log(timeoutIds, 'timeoutIds');
  return (
    <>
      <div>
        <label>Please enter an email to search</label>
        <div className='flex-col'>
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => handleDebounce(e)}
          />
          <UserList friendList={searchResults} />
        </div>
        {/* <button onClick={findUserWithEmail}>Find Friend</button> */}
      </div>
    </>
  );
}
