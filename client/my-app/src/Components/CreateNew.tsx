import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form , ErrorMessage, FieldArray } from 'formik';
import { Button } from 'react-bootstrap';
import axios from 'axios';

function CreateNew(props: any) {
    
  const [message, setMessage] = useState(null)
  const initialValues = {
        questions: [
          {
            question: ''
          },
        ],
  };

  function submitSurvey(survey: string){
    axios({
      method: "POST",
      url:"/submit_survey",
      headers: {
        Authorization: 'Bearer ' + props.token,
        "Content-Type": 'application/json'},
      data: survey
    })
    .then((response) => {
      setMessage((response.data.msg))
    }).catch((error) => {
      if (error.response) {
        setMessage((error.response.data.msg))
        }
    })
  }
    

    return (
        
    <div>
      <p className="text-info">{message}</p>
      <h1>Create New Survey</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          const survey = JSON.stringify(values, null, 2);
          submitSurvey(survey);
        }}
      >
        
        {({ values }) => (
        <Form>
          <div className="col"><label htmlFor={'title'} className="form-label">Pick a title:</label></div>
          <Field required
            name='title'
            placeholder="My Survey"
            type="text"
          />
          <FieldArray name="questions">
            {({ insert, remove, push }) => (
              <div>
                {values.questions.length > 0 &&
                  values.questions.map((question, index) => (
                    <div className="row" key={index}>
                    <div className="col">
                      <label htmlFor={`questions.${index}.question`}>Question</label>
                      <Field required
                        name={`questions.${index}.question`}
                        type="text"
                      />
                      <ErrorMessage
                        name={`questions.${index}.question`}
                        component="div"
                        className="field-error"
                      />
                    </div>
                    <div className="col">
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => remove(index)}
                      >x</Button>
                    </div>
                    </div>
                  ))}
                <Button
                  type="button"
                  variant="outline-primary"
                  size="lg"
                  onClick={() => push({ question: '' })}
                >
                  Add Question
                </Button>
              </div>
            )}
          </FieldArray>
          <Button type="submit" size="lg">Submit</Button>
        </Form>
        )}
      </Formik>
    </div>
  );
    

}

export default CreateNew;