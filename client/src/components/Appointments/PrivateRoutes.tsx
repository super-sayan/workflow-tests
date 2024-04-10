import { useContext } from "react";
import { AccountContext } from "../AccountContext";
const { Outlet, Navigate } = require("react-router");

const useAuth = () => {
  const { user } = useContext(AccountContext) as { user: { loggedIn: boolean, email: string, token: string } };
  return user && user.loggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
