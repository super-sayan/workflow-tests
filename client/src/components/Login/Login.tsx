import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../AccountContext";
import axios from "axios";
import TextField from "./TextField";
import LoggedInRedirect from "./LoginRedirect";
const Yup = require("yup");


const Login = () => {
  const { setUser } = useContext(AccountContext) as any;
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const formSchemaLogin = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Email must be valid"
      ),
    password: Yup.string()
      .required("Password is required")
  });  

  const handleLogin = (values: any, actions: { resetForm: () => void; }) => {
    const vals = { ...values };
    actions.resetForm();

    axios.post("http://localhost:4000/auth/login", vals, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res || !res.data) {
          return;
        }

        const data = res.data;
        setUser({ ...data, email: vals.email }); 
        if (data.status) {
          setError(data.status);
        } else if (data.loggedIn) {
          navigate("/appointments");
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
  
  return (
    <>
      <LoggedInRedirect />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={formSchemaLogin}
        onSubmit={handleLogin}
      >
        <VStack
          as={Form}
          w={{ base: "90%", md: "500px" }}
          m="auto"
          justify="center"
          h="100vh"
          spacing="1rem"
        >
          <Heading>Log In</Heading>
          <Text as="p" color="red.500">
            {error}
          </Text>
          <TextField
            name="email"
            placeholder="Enter email"
            autoComplete="on"
            label="Email"
            type="email"
            required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          />

          <TextField
            name="password"
            placeholder="Enter password"
            autoComplete="off"
            label="Password"
            type="password"
          />

          <ButtonGroup pt="1rem">
            <Button colorScheme="teal" type="submit">
              Log In
            </Button>
            <Button colorScheme="blue" onClick={() => navigate("/register")}>Sign Up</Button>
          </ButtonGroup>
        </VStack>
      </Formik>
    </>
  );
};

export default Login;