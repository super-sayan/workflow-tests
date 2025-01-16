import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Survey from './Components/Survey'
import Stats from './Components/Stats'
import useToken from './Components/useToken'
import Login from './Components/Login'
import Header from './Components/Header'
import React from 'react';
import NavBar from './Components/Navbar';
import SignUp from './Components/SignUp';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TakeSurvey from './Components/TakeSurvey';
import CreateNew from './Components/CreateNew';
import MySurveyStat from './Components/MySurveyStat';
import Index from './Components/Index';


function App() {
  
  const { token, removeToken, setToken } = useToken();

  return (
    <div className="App">
      <NavBar />
      <div className="p-5 bg-dark text-white text-center">
        <h1 className="display-1">Do you like giving feedback?</h1>
        <p>Good because this is a feedback mechanism app</p> 
      </div>
      
      <header className="App-header">
      {!token || token=="" || token == undefined || token == 'undefined'?  
        <>
        <Container>
          <Row>
            <Col><Login setToken={setToken} /></Col>
            <Col><SignUp /></Col>
          </Row>
        </Container>
        </>
        :(
          <>
            <Router>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/Survey" element={<Survey token={token}/>} />
              <Route path="/CreateNew" element={<CreateNew token={token}/>} />
              <Route path="/Stats" element={<Stats token={token}/>} />
              <Route path="/Stats/:surveyId" element={<MySurveyStat token={token}/>} />
              <Route path="/TakeSurvey/:surveyId" element={<TakeSurvey token={token}/>}/>
              <Route path="/LogOut" element={<Header token={removeToken}/>}></Route>
              </Routes>
            </Router>
          </>
        )}
      
      </header>
    </div>
  );
}

export default App;
