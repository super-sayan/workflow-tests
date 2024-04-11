import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../AccountContext";
import TextField from "./TextField";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const SignUp = () => {
  const { signupUser } = useContext(AccountContext) as any;
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const formSchemaSignup = z.object({
    email: z.string()
      .min(1, { message: "Please Enter your Email" })
      .email({ message: "Email must be valid" }),
    name: z.string()
      .min(1, { message: "Please Enter your Full Name" })
      .regex(/^[a-zA-Z]+\s[a-zA-Z]+$/, { message: "Must contain your First and Last name in English, divided by space" }),
    password: z.string()
      .min(1, { message: "Please Enter your password" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, { message: "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character" }),
    password2: z.string()
      .min(1, { message: "You have to confirm your password" })
  }).refine((data: { password: string; password2: string; }) => data.password === data.password2, {
    message: "Password must match!",
    path: ["password2"]
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", name: "", password2: "" }}
      validationSchema={toFormikValidationSchema(formSchemaSignup)}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        actions.resetForm();

        axios.post("http://localhost:4000/auth/signup", vals, {
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
              signupUser(data.token);
              navigate("/appointments");
            }
          })
          .catch(err => {
            console.error(err);
          });
      }}
    >
      <VStack
        as={Form}
        w={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing="1rem"
      >
        <Heading>Sign Up</Heading>
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
          name="name"
          placeholder="Your full name"
          autoComplete="on"
          label="Name"
          type="name"
          required pattern="^[a-zA-Z]+\s[a-zA-Z]+$"
        />

        <TextField
          name="password"
          placeholder="Enter password"
          autoComplete="off"
          label="Password"
          type="password"
        />

        <TextField
          name="password2"
          placeholder="Confirm password"
          autoComplete="off"
          label="Confirm password"
          type="password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="blue" type="submit">
            Create Account
          </Button>
          <Button colorScheme="teal" onClick={() => navigate("/login")} leftIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default SignUp;
