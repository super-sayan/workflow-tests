import { useState } from 'react';
import axios from "axios";
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function SignUp(props: any) {

    const [signUpForm, setsignUpForm] = useState({
      username: "",
      password: ""
    })
    const [message, setMessage] = useState(null)


    function sendform(event: any) {
        
        axios({
          method: "POST",
          url:"/sign_up",
          data:{
            username: signUpForm.username,
            password: signUpForm.password
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
  
        setsignUpForm(({
          username: "",
          password: ""}))
        event.preventDefault()
      }

      function handleChange(event: any) { 
        const {value, name} = event.target
        setsignUpForm(prevNote => (
          {...prevNote, [name]: value})
        )}

        return (
            <>
            <h2>Sign Up</h2>
            <Form>
            <Form.Group className="mb-3">
            
                  <p className="text-info">{message}</p>
                
              <Form.Label>Username</Form.Label>
              <OverlayTrigger
                placement="top"
                delay={{ show: 100, hide: 400 }}
                overlay={(props: any) => (
                <Tooltip {...props}>
                <p>Your username must be 1-30 characters long, and contain letters and/or numbers.
                      It must not contain spaces or special characters.</p>
                </Tooltip>)}>
                <Form.Control type="username" 
                            placeholder="Enter username"
                            onChange={handleChange}
                            data-text={signUpForm.username}
                            name="username" 
                            required
                            autoComplete='on'
                            value={signUpForm.username}/>
              </OverlayTrigger>
                
            </Form.Group>
      
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <OverlayTrigger
                placement="top"
                delay={{ show: 100, hide: 400 }}
                overlay={(props: any) => (
                <Tooltip {...props}>
                <p>Your password must be 8-30 characters long, and contain uppercase, lowercase and numbers.
                  It must not contain spaces or special characters.</p>
                </Tooltip>)}>
                <Form.Control onChange={handleChange} 
                        type="password"
                        data-text={signUpForm.password} 
                        name="password" 
                        placeholder="Password" 
                        required
                        value={signUpForm.password} 
                        />
              </OverlayTrigger>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={sendform}>
              Submit
            </Button>
          </Form>
            </>
            
          );
}

export default SignUp;
