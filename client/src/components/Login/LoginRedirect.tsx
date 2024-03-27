import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../AccountContext";

const LoggedInRedirect = () => {
  const { user } = useContext(AccountContext) as { user: { loggedIn: boolean } };
  const navigate = useNavigate();

  useEffect(() => {
    if (user.loggedIn) {
      navigate("/appointments");
    }
  }, [user, navigate]);

  return null;
};

export default LoggedInRedirect;
