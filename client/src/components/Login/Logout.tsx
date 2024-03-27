import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../AccountContext";
import axios from "axios";

const Logout = () => {
    const { setUser } = useContext(AccountContext) as any;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:4000/auth/logout", {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
        })
        .then(res => {
            const data = res.data;
            setUser({ ...data });
            navigate("/login");
          })
    }, []);

    return <p>Logging out...</p>;
};

export default Logout;
