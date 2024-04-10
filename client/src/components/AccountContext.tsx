import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";

interface User {
  loggedIn: boolean;
  token: string | null;
  email: string | null;
}

interface UserContextProps {
  children: ReactNode;
}

export const AccountContext = createContext<{
  user: User;
  loginUser: (token: string) => void;
  logoutUser: () => void;
  signupUser: (token: string) => void;
}>({
  user: { loggedIn: false, token: null, email: null },
  loginUser: () => {},
  logoutUser: () => {},
  signupUser: () => {},
});

const UserContext: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<User>({ loggedIn: false, token: null, email: null });

  useEffect(() => {
    const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      const decodedToken = jwtDecode(tokenCookie.split('=')[1] as string);
      const email = decodedToken.email;
      setUser({ loggedIn: true, token: tokenCookie.split('=')[1], email });
    }
  }, []);

  const loginUser = (token: string) => {
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()};`;
    setUser({ loggedIn: true, token, email });
  };

  const logoutUser = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    setUser({ loggedIn: false, token: null, email: null });
  };

  const signupUser = (token: string) => {
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()};`;
    setUser({ loggedIn: true, token, email });
  };

  return (
    <AccountContext.Provider value={{ user, loginUser, logoutUser, signupUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
