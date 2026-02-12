import { useContext } from "react";
import { createContext } from "react";

import { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const defaultUserData = { userId: null, username: null };
  const [userData, setUserData] = useState(defaultUserData);
  const [loading, setLoading] = useState(true);

  const authenticateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/authenticate-user`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status !== 200)
        throw new Error("Error while autheticating user please login again!");

      const { user_id, name } = await response.json();

      // setUserData({ userId: user_id, username: name });
      updateLoginState(user_id, name);
    } catch (error) {
      setUserData(defaultUserData);
      console.log(error, "error");
    }
    setLoading(false);
  };

  const updateLoginState = (userId, username) => {
    setLoading(true);
    setUserData({ userId, username });
    setLoading(false);
  };

  const handleLogout = async () => {
    const response = await fetch(`${backendUrl}/logout`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Error while logging out");

    updateLoginState(null, null);
  };

  useEffect(() => {
    authenticateUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        userId: userData.userId,
        username: userData.username,
        loading,
        updateLoginState,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
