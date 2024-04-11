import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext } from "../AccountContext";
import axios from "axios";
import { useNavigate } from "react-router";
import { Form, Formik } from "formik";
import TextField from "./TextField";
import LoggedInRedirect from "./LoginRedirect";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const Login = () => {
  const { loginUser } = useContext(AccountContext) as any;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formSchemaLogin = z.object({
    email: z.string()
      .min(1, { message: "Email is required" })
      .email({ message: "Email must be valid" }),
    password: z.string()
      .min(1, { message: "Password is required" })
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
        if (data.status) {
          setError(data.status);
        } else if (data.loggedIn) {
          loginUser(data.token);
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
        validationSchema={toFormikValidationSchema(formSchemaLogin)}
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
