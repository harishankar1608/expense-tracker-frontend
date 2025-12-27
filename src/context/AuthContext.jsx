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

      setUserData({ userId: user_id, username: name });
    } catch (error) {
      setUserData(defaultUserData);
      console.log(error, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    authenticateUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{ userId: userData.userId, username: userData.username, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
