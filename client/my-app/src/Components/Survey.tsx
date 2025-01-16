import axios from "axios";
import React from "react";
import {useState, useEffect} from 'react';
import SurveyItem from "./SurveyItem";
import ListGroup from 'react-bootstrap/ListGroup';


export default function Survey(props: any) {
    
    const [initialState, setState] = useState(null)
    const [message, setMessage] = useState(null)


    const request = {
        method: "GET",
        url:"/take_survey",
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      }
      useEffect(()=> {
      axios(request)
      .then((response) => {
        const res =response.data
        const surveys = res.map((survey: any, i: any) =>
        <div key={i}>{<SurveyItem props={survey} />}</div>)
        setState(surveys)
        setMessage(res.msg)
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