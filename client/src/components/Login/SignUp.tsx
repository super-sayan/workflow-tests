import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../AccountContext";
import TextField from "./TextField";
const Yup = require("yup");

const SignUp = () => {
  const { signupUser } = useContext(AccountContext) as any;
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const formSchemaSignup = Yup.object({
    email: Yup
      .string()
      .required('Please Enter your Email')
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Email must be valid"
      ),
    name: Yup
      .string()
      .required('Please Enter your Full Name')
      .matches(
        /^[a-zA-Z]+\s[a-zA-Z]+$/,
        "Must contain your First and Last name in English, devided by space"
      ),
    password: Yup
      .string()
      .required('Please Enter your password')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    password2: Yup
      .string()
      .required('You have to confirm your password')
      .oneOf([Yup.ref("password"), null], "Passwords must match")
  });  

  return (
    <Formik
      initialValues={{ email: "", password: "", name: "", password2: "" }}
      validationSchema={formSchemaSignup}
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
            signupUser(data.token);

            if (data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
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
