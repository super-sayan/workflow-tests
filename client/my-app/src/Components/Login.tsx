import { useState } from 'react';
import axios from "axios";
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Login(props: any) {

    const [loginForm, setloginForm] = useState({
      username: "",
      password: ""
    })
    const [message, setMessage] = useState(null)

    function logMeIn(event: any) {
        
        axios({
          method: "POST",
          url:"/token",
          data:{
            username: loginForm.username,
            password: loginForm.password
           }
        })
        .then((response) => {
          setMessage((response.data.msg))
          props.setToken(response.data.access_token)
        }).catch((error) => {
          if (error.response) {
            setMessage((error.response.data.msg))
            }
        })
  
        setloginForm(({
          username: "",
          password: ""}))
  
        event.preventDefault()
      }

      function handleChange(event: any) { 
        const {value, name} = event.target
        setloginForm(prevNote => ({
            ...prevNote, [name]: value})
        )}

        return (
            <>
            <h2>Log In</h2>
            <Form>
            <Form.Group className="mb-3">
            <p className="text-info">{message}</p>
              <Form.Label>Username</Form.Label>
              <Form.Control required
                            type="username" 
                            placeholder="Enter username"
                            onChange={handleChange}
                            data-text={loginForm.username}
                            name="username" 
                            value={loginForm.username}
                            />
            </Form.Group>
      
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control required
                        onChange={handleChange} 
                        type="password"
                        data-text={loginForm.password} 
                        name="password" 
                        placeholder="Password" 
                        value={loginForm.password} 
                        />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={logMeIn}>
              Submit
            </Button>
          </Form>
            </>
            
          );
}

export default Login;
