import React, { ReactNode, useEffect } from 'react';
const { createContext, useState } = require("react");
export const AccountContext = createContext();

interface UserContextProps {
  children: ReactNode;
}

const UserContext: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null, token: null, email: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    //const loggedIn = localStorage.getItem("loggedIn") === "true";

    if (token) {
      setUser({ loggedIn: true, token });
    } else {
      setUser({ loggedIn: false, token: null });
    }
  }, []);

  const loginUser = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", "true");
    setUser({ loggedIn: true, token, email });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.setItem("loggedIn", "false");
    setUser({ loggedIn: false, token: null });
  };

  const signupUser = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", "true");
    setUser({ loggedIn: true, token, email });
  };

  return (
    <AccountContext.Provider value={{ user, loginUser, logoutUser, signupUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
