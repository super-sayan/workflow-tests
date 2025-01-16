import axios from "axios";
import React from "react";
import {useState, useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import MySurveyItem from "./MySurveyItem";


export default function Stats(props: any) {
    
    const [initialState, setState] = useState(null)
    const [message, setMessage] = useState(null)

    const request = {
        method: "GET",
        url:"/stats",
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      }
      console.log(request)
      useEffect(()=> {
      axios(request)
      .then((response) => {
        const res =response.data
        const surveys = res.map((survey: any, i: any) =>
        <div key={i}>{<MySurveyItem props={survey} token={props.token}/>}</div>)
        setState(surveys);
        setMessage(res.msg);
      }).catch((error) => {
        if (error.response) {
          setMessage((error.response.data.msg))
          }
      })}, [])
  
    return (
        
        <>
            <p className="text-info">{message}</p>
            <ListGroup>
                <div>{initialState}</div>
            </ListGroup>
        </>
    )
}