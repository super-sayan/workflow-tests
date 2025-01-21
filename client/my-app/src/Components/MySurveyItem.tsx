import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MySurveyItem(props: any) {
    
    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function Disable(event: any) {
        handleClose();
        const request = {
            method: "GET",
            url:"/stats/" + props.props.id + "/disable",
            headers: {
              Authorization: 'Bearer ' + props.token
            }
          }
        console.log(request);
        axios(request)
        .then((response) => {
        const res =response.data
        setMessage(res.msg)
        }).catch((error) => {
        if (error.response) {
            setMessage((error.response.data.msg))
            }
        })
        event.preventDefault()
    }

    function Delete(event: any) {
        handleClose();
        const request = {
            method: "GET",
            url:"/stats/" + props.props.id + "/delete",
            headers: {
              Authorization: 'Bearer ' + props.token
            }
          }
        console.log(request);
        axios(request)
        .then((response) => {
        const res =response.data
        setMessage(res.msg)
        }).catch((error) => {
        if (error.response) {
            setMessage((error.response.data.msg))
            }
        })
        event.preventDefault()
    }

    return (
        <>
            <p className="text-info">{JSON.parse(JSON.stringify(message))}</p>
            <ListGroup.Item><h5>{props.props.title}</h5><ButtonGroup>
            <Button variant="primary"><Link to={'/Stats/' + props.props.id} style={{ color: '#FFF' }}>Show Stats</Link></Button>
            
            {!props.props.is_disabled?
            <Button variant="warning" onClick={Disable}>Disable</Button>
            :<Button variant="warning" disabled>Disable</Button>}

            <Button variant="danger" onClick={handleShow}>Delete</Button>
            </ButtonGroup></ListGroup.Item> 

            <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete this survey?</Modal.Title>
            </Modal.Header>
            <Modal.Body>All of the data wiil be lost and you will not be able to view survey statistics. If you still wish to view survey statistics, choose 'disable' instead.</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="warning" onClick={Disable}>Disable instead</Button>
            <Button variant="danger" onClick={Delete}>Delete</Button>
            </Modal.Footer>
            </Modal>

        </>
    )
}