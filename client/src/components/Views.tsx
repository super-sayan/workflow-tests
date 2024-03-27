import { Text } from "@chakra-ui/layout";
import { useContext } from "react";
import { AccountContext } from "./AccountContext";
import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import PrivateRoutes from "./Appointments/PrivateRoutes";
import Home from "./Home";
import Menu from "./Menu";
import Contact from "./Contact"
import Posts from "./Appointments/Posts";
import Post from "./Appointments/Post";
import SignUp from "./Login/SignUp";
import Logout from "./Login/Logout";

const Views = () => {
  const { user } = useContext(AccountContext) as { user: { loggedIn: boolean } };
  return user.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/appointments" element={<Posts />} />
          <Route path="/reservation" element={<Post />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Login />} />
      </Routes>
  );
};

export default Views;
