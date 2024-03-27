import { useState, useEffect } from "react";
import { VStack, Heading, Text, Button, ButtonGroup, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import axios from 'axios';
import { useContext } from "react";
import { AccountContext } from "../AccountContext";
import { useNavigate } from "react-router";

function Posts() {

  interface Data {
    name: string;
    email: string;
    meal_kind: string;
    appointment_remark: string;
    date: string;
    time: string;
  }
  const [data, setData] = useState<Array<Data>>([]);
  const navigate = useNavigate();
  const { user } = useContext(AccountContext) as { user: { loggedIn: boolean, email: string } };

  useEffect(() => {
    if (user.loggedIn){
      axios.get("http://localhost:4000/appointments", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "User-Email": user.email
        }
      })
        .then((response) => setData(response.data))
        .catch((error) => console.log(error));
    }
  }, []);

  if (user.loggedIn !== true ){
    navigate("/login");
    return null;
  } 
  return (
    <VStack
      w={{ base: "100%", md: "900px" }}
      m="auto"
      justify="center"
      h="100vh"
      spacing="1rem"
    >
      <Heading>Appointments</Heading>
      <Text fontSize={"20"}>
        Pay attention, you have orderd a specific time for visiting our 
        restaurant, we advice you to arrive 10 minutes before your 
        reservation, if you will be late for more than 15 minutes your 
        reservation will be cancelled add will have to make a new appointment. 
      </Text>
      <Text fontSize={"22"}>
        You can see your appointments below:
      </Text>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Name</Th>
              <Th>Meal</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Remark</Th>
            </Tr>
          </Thead>
          <Tbody>
          {data.map((d, i) => (
            <Tr key={i}>
              <Td>{d.email}</Td>
              <Td>{d.name}</Td>
              <Td>{d.meal_kind}</Td>
              <Td>{d.date.split("T")[0]}</Td>
              <Td>{d.time}</Td>
              <Td>{d.appointment_remark}</Td>
            </Tr>
          ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ButtonGroup pt="1rem">
        <Button colorScheme="blue" onClick={() => navigate("/reservation")}> Make an appointment </Button>
        <Button colorScheme="teal" onClick={() => navigate("/logout")}>Logout</Button>
      </ButtonGroup>
    </VStack>
  );
}

export default Posts;