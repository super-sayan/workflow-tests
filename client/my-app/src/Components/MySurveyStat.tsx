import axios from "axios";
import React from "react";
import {useState, useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from "react-router-dom";
import QuestionStat from "./QuestionStat";

export default function Stats(props: any) {
    
    const [initialState, setState] = useState('');
    const [message, setMessage] = useState('');
    const [info, setInfo] = useState({title: '', entries: 0});
    const { surveyId } = useParams();
    const path = "/stats/" + surveyId;

    const request = {
        method: "GET",
        url: path,
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      }
      console.log(request)
      useEffect(()=> {
      axios(request)
      .then((response) => {
        const res =response.data
        const questions = res.questions.map((question: any, i: any) =>
        <div key={i}>{<QuestionStat props={question} />}</div>)
        setState(questions)
        setInfo(res.info)
      }).catch((error) => {
        if (error.response) {
          setMessage(error.response.data.msg)
          }
      })}, [])
  
    return (
        
        <>
            <p className="text-info">{message}</p>
            <ListGroup>
                <div className="mb-5">
                  <h1 className="display-4">{info.title}</h1>
                  <p>{info.entries} people took part in this survey</p>
                  </div>
                <div>{initialState}</div>
            </ListGroup>
        </>
    )
}