import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";



function Header(props: any) {

    const navigate = useNavigate()
    axios({
      method: "POST",
      url:"/logout",
    })
    .then((response) => {
       props.token()
       navigate("/");
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })

    return(
        <>...
      </> 

    )
}

export default Header;