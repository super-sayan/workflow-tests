import axios from "axios";
import React from "react";
import {useState, useEffect} from 'react';
import { useParams } from "react-router-dom"
import Button from 'react-bootstrap/Button';
import { Formik, Field, Form , ErrorMessage, FieldArray } from 'formik';




export default function TakeSurvey(props: any) {
    
    const [message, setMessage] = useState(null)
    const { surveyId } = useParams();
    const [values, setValues] = useState({questions: [{id: 1, question: ''}]})
    const path = "/take_survey/" + surveyId

    const request = {
        method: "GET",
        url: path,
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      }
      useEffect(()=> {
      axios(request)
      .then((response) => {
        const res =response.data
        setValues(res);
        setMessage(res.msg)
      }).catch((error) => {
        if (error.response) {

          setMessage((error.response.data.msg))
          }
      })}, [])

      const SendSurvey = (survey: string) => {
            axios({
              method: "POST",
              url: path + "/send",
              headers: {
                Authorization: 'Bearer ' + props.token,
                "Content-Type": 'application/json'},
              data: survey,
            })
            .then((response) => {
              setMessage((response.data.msg))
              props.setToken(response.data.access_token)
            }).catch((error) => {
              if (error.response) {
                setMessage((error.response.data.msg))
                }
            })
      }
     
    return ( 
      <>
        <p className="text-info">{message}</p>
        <Formik
          enableReinitialize={true}
          initialValues={values}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 500));
            const survey = JSON.stringify(values, null, 2);
            SendSurvey(survey);
          }}
        >
          
          {({ values }) => (
          <Form>
            <FieldArray name="questions">
              {() => (
                <div>
                  {values.questions.length > 0 &&
                    values.questions.map((question, index) => (
                      <div key={index}>
                        <label className="form-label" htmlFor={`questions[${index}].value`}>{question.question}</label>
                        <Field required
                          name={`questions[${index}].value`}
                          type="range"
                          className="form-range" 
                          min="1" 
                          max="5" 
                          step="1"
                        />
                        <ErrorMessage
                          name={`questions[${index}].value`}
                          component="div"
                          className="field-error"
                        />
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>
            <Button type="submit" size="lg">Submit</Button>
          </Form>
          )}
        </Formik>
      </>
    )
}