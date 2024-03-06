//import React, { useEffect } from "react";
import { useParams } from "react-router";
import React, { useState, useEffect } from "react";
import axios from 'axios';
function Post() {
  let { postSlug } = useParams();

  useEffect(() => {
  }, [postSlug]);
  
  const [formValue, setformValue] = useState({
    user_name: '',
    user_email: '',
    meal_kind: '',
    appointment_remark: '',
    date: '',
    time: ''

  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send data to the backend using axios POST request
    axios.post("http://localhost:3001/users/dashboard", formValue)
      .then((response) => {
        console.log("Data successfully submitted:", response.data);
        // Optionally, you can update the state or perform any other actions after successful submission.
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformValue({
      ...formValue,
      [name]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="home">
        <div class="container">
          <h1 className="mt-5">Making New Appointment</h1>
          <h6 className="mb-5">Hello, {postSlug}!</h6>
          <fieldset>
            <h5>Your basic details:</h5>
            <label for="name">Name*:</label>
            <input type="text" id="name" name="user_name" required pattern="[a-zA-Z0-9]+" 
              value={formValue.user_name}
              onChange={handleChange}
            />
            <label for="mail">Email*:</label>
            <input type="email" id="email" name="user_email" required
              value={formValue.user_email}
              onChange={handleChange}              
            />
          </fieldset>
          <fieldset>
            <label for="meal_kind">Appointment for*:</label>
            <select id="meal_kind" name="meal_kind" required
              value={formValue.meal_kind}
              onChange={handleChange}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Business Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <label for="appointment_remark">Appointment Remark:</label>
            <textarea id="appointment_remark" name="appointment_remark"
              value={formValue.appointment_remark}
              onChange={handleChange}              
            />
            <label for="date">Date*:</label>
            <input type="date" id="date" name="date" required
              value={formValue.date}
              onChange={handleChange}              
            />
            {/* <br> */}
            <label for="time">Time*:</label>
            <input type="time" id="time" name="time" min="09:00" max="18:00" required 
              value={formValue.time}
              onChange={handleChange}              
            />
            <small>Cafe is open from 9am until 6pm.</small>
            {/* </br> */}
          </fieldset>
          <input type="submit" value="Request for appointment" />
        </div>
      </div>
    </form>
  );
}

export default Post;