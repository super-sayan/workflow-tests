import ListGroup from 'react-bootstrap/ListGroup';
import React from 'react';
import { Link } from 'react-router-dom';

export default function SurveyItem(props: any) {

    return (
        <>
            <ListGroup.Item><h5>{props.props.title}</h5>
            <Link to={'/TakeSurvey/' + props.props.id}>Take Survey!
            </Link>
            </ListGroup.Item> 
        </>
    )
}