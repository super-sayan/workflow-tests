import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../AccountContext";
import axios from "axios";

const Logout = () => {
    const { logoutUser } = useContext(AccountContext) as any; // Update to use logoutUser
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:4000/auth/logout", {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
        })
        .then(() => {
          logoutUser(); // Call logoutUser function
          navigate("/login");
        })
  }, []);

    return <p>Logging out...</p>;
};

export default Logout;
