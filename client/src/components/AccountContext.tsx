import { useNavigate } from "react-router";
import React, { ReactNode, useEffect } from 'react';
import axios from 'axios'; // Import axios

const { createContext, useState } = require("react");

export const AccountContext = createContext();

interface UserContextProps {
  children: ReactNode;
}

const UserContext: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:4000/auth/login", {
      withCredentials: true, // equivalent to credentials: 'include' in fetch
    })
      .then(response => {
        const data = response.data;
        setUser({ ...data });
        navigate("/");
      })
      .catch(() => {
        setUser({ loggedIn: false });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;