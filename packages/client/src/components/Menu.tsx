//import React from "react";
//import React = require('react');
//import imageToAdd from "../assets/images/";
const logo = require('../assets/images/Cat_Den.png');

function Menu() {
  return (
    <div className="menu">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            {/* <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src="http://placehold.it/3002×4201"
              alt=""
            /> */}
            <img alt='logo' style={{ width: 600 }} src={String(logo)} />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-dark">Menu</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;