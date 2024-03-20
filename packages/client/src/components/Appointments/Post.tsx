import { useState } from "react";
import { useNavigate } from "react-router";
import { Formik, Form } from "formik";
import axios from 'axios';
import { VStack, Heading, Text, Button, ButtonGroup, Select, Textarea, FormLabel, FormControl } from "@chakra-ui/react";
import TextField from "../Login/TextField";
import { useContext } from "react";
import { AccountContext } from "../AccountContext";
const {formSchemaPost} = require("@happy-cat/common");

function Post() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AccountContext) as { user: { loggedIn: boolean, email: string } };

  if (user.loggedIn !== true) {
    navigate("/login");
    return null;
  }

  return (
    <Formik
      initialValues={{ email: "", name: "", meal_kind: "", date: "", time: "", appointment_remark: "" }}
      validationSchema={formSchemaPost}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        actions.resetForm();

        axios.post("http://localhost:4000/appointments", vals, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(res => {
          if (res) {
            navigate("/appointments");
          }
          const data = res.data;
          if (data.status) {
            setError(data.status);
          }
        })
        .catch(err => {
          console.error(err);
        });
      }}
    >
      {({ handleChange, values }) => (
        <Form>
          <VStack
            w={{ base: "90%", md: "500px" }}
            m="auto"
            justify="center"
            h="120vh"
            spacing="1rem"
          >
            <Heading>Appointment Form</Heading>
            <Text color="red.500">{error}</Text>

            <TextField
              id="email"
              name="email"
              placeholder="Enter email"
              autoComplete="on"
              label="Email"
              type="email"
              required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              value={values.email}
              onChange={handleChange}
            />

            <TextField
              id="name"
              name="name"
              placeholder="Enter Full Name"
              autoComplete="on"
              label="Full Name"
              type="text"
              required pattern="^[a-zA-Z]+\s[a-zA-Z]+$"
              value={values.name}
              onChange={handleChange}
            />

            <FormControl id="meal_kind">
              <FormLabel>Meal</FormLabel>
              <Select
                name="meal_kind"
                value={values.meal_kind}
                onChange={handleChange}
                required
                //placeholder="Choose Meal Kind"
              >
                <option style={{ color: 'black' }} value="Breakfast">Breakfast</option>  
                <option style={{ color: 'black' }} value="Business Lunch">Business Lunch</option>
                <option style={{ color: 'black' }} value="Dinner">Dinner</option>
              </Select>
            </FormControl>

            <TextField
              id="date"
              name="date"
              label="Choose Date"
              type="date"
              required
              value={values.date}
              onChange={handleChange}
            />
            <Text fontSize="sm" color="gray.500">You can make an appointment only for 3 months in advance.</Text>

            <TextField
              id="time"
              name="time"
              label="Choose Time"
              type="time"
              min="09:00" 
              max="18:00" 
              required
              value={values.time}
              onChange={handleChange}
            />
            <Text fontSize="sm" color="gray.500">Cafe is open from 9am until 6pm.</Text>

            <FormControl id="appointment_remark">
              <FormLabel>Additional Remarks</FormLabel>
              <Textarea
                id="appointment_remark"
                name="appointment_remark"
                placeholder="Enter any additional comments"
                value={values.appointment_remark}
                onChange={handleChange}
              />
            </FormControl>

            <ButtonGroup pt="1rem">
              <Button colorScheme="blue" type="submit">
                Make an appointment 
              </Button>
              <Button colorScheme="teal" onClick={() => navigate("/appointments")}>back</Button>
            </ButtonGroup>
          </VStack>
        </Form>
      )}
    </Formik>
  );
}
export default Post;