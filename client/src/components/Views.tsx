import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Menu from "./Menu";
import Contact from "./Contact";
import Posts from "./Appointments/Posts";
import Post from "./Appointments/Post";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import Logout from "./Login/Logout";
import PrivateRoutes from "./Appointments/PrivateRoutes";

const App = () => {
  return (
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

export default App;
