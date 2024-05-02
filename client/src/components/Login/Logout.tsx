import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../AccountContext";
import axios from "axios";

const Logout = () => {
    const { logoutUser } = useContext(AccountContext) as any; 
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/auth/logout", {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
        })
        .then(() => {
          logoutUser();
          navigate("/login");
        })
    }, [logoutUser, navigate]);

    return <p>Logging out...</p>;
};

export default Logout;
