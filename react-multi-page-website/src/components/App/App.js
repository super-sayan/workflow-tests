// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
//-----------------------------------------------------
// client/src/App.js

// import React from "react";
// import logo from "./logo.svg";
// import "./App.css";

// function App() {
//   const [data, setData] = React.useState(null);

//   React.useEffect(() => {
//     fetch("/api")
//       .then((res) => res.json())
//       .then((data) => setData(data.message));
//   }, []);


//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>{!data ? "Loading..." : data}</p>
//       </header>
//     </div>
//   );
// }

// export default App;
//________________________________________________

// import React from 'react';
// import logo from './logo.svg';
// import './App.css'
// class App extends React.Component{
//   constructor(props){
//     super(props);
//     this.state={apiResponse:""};
//   }
//   callAPI(){
//     fetch("http://localhost:3001/")
//       .then(res => res.text());
//       // .then(res => this.useState({apiResponse: res}));
//   }
//   componentWillMount(){
//     this.callAPI();
//   }
//   render(){
//     return (
//       <div className="App">
//         <header className="App-header">
//           {/* <img src={logo} className="App-logo" alt="logo" /> */}
//           <p>{this.state.apiResponse}</p>
//         </header>
     
//       </div>
//     );
//   }
// }
// export default App;
//_____________________________________________________

import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';

function App() {
    return (
      <div className="wrapper">
        <h1>Application</h1>
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/preferences">
              <Preferences />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
}
  
export default App;
// function App() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3001/users")
//       .then((res) => res.json())
//       .then((data) => setData(data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div style={{ padding: "50px" }}>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Password</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((d, i) => (
//             <tr key={i}>
//               <td>{d.id}</td>
//               <td>{d.name}</td>
//               <td>{d.email}</td>
//               <td>{d.password}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
      
//     </div>
//   );
// }

// export default App;

//____________________________________________________________________
// <div>
//   <div>
//   <input
//       type="email"
//       id="email"
//       name="email"
//       placeholder="Email"
//       required
//     />
//   </div>
//   <div>
//     <input
//       type="password"
//       id="password"
//       name="password"
//       placeholder="Password"
//       required
//     />
//   </div>
//   <div>
//     <input type="submit" value="Login" />
//   </div>
//   <a href="/users/register">Register</a>
// </div>


//----------------------------------------------

// import React, { useEffect } from "react"

// function App() {
//   axios({
//     method: 'post',
//     url: 'http://localhost:3001/users/login',
//     timeout: 4000,    // 4 seconds timeout
//      data: {
//        firstName: 'David',
//        lastName: 'Pollock'
//     }
//   })
//   .then(response => {/* handle the response */})
//   .catch(error => console.error('timeout exceeded'));
// }

// export default App