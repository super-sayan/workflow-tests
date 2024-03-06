// import React from "react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from 'axios';
//import './App.css';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Dashboard from '../Dashboard/Dashboard';
// import Preferences from '../Preferences/Preferences';


function Posts() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/appointments")
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="home">
      <div class="container">
        {/* <Link to="/appointments/this-is-a-post-title"> */}
          <div class="row align-items-center my-5">
            <div class="col-lg-7">
              {/* <img  
                class="img-fluid rounded mb-4 mb-lg-0"
                src="http://placehold.it/900x400"
                alt=""
              /> */}
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Meal Kind</th>
                    <th>Appointment Remark</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (                    
                    <tr key={i}>
                      <td>{d.id}</td>
                      <td>{d.name}</td>
                      <td>{d.email}</td>
                      <td>{d.meal_kind}</td>
                      <td>{d.appointment_remark}</td>
                      <td>{d.date}</td>
                      <td>{d.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div class="col-lg-5">
              <h1 class="font-weight-light">This is a post title</h1>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <Link to="/appointments/this-is-a-post-title">
                <h3>Make new appointment!</h3>
              </Link>
            </div>
          </div>
        {/* </Link> */}
      </div>
    </div>
  );
}

export default Posts;