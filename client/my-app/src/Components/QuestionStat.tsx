import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function QuestionStat(props: any) {

    
      
    return (
        <>
            <h3>{props.props.question}</h3>
            <Container fluid className="mb-4 w-100">
            
            <Row>
                <Col><h5>5</h5></Col>
                <Col>
                    <ProgressBar variant="success" min={0} max={props.props.total_entries} now={props.props.answer_5_count} />
                </Col>
                <Col><h5>{props.props.answer_5_count} entries</h5></Col>
            </Row>
            <Row>
                <Col><h5>4</h5></Col>
                <Col>
                    <ProgressBar variant="primary" min={0} max={props.props.total_entries} now={props.props.answer_4_count} />
                </Col>
                <Col><h5>{props.props.answer_4_count} entries</h5></Col>
            </Row>
            <Row>
                <Col><h5>3</h5></Col>
                <Col>
                <ProgressBar variant="info" min={0} max={props.props.total_entries} now={props.props.answer_3_count} />
                </Col>
                <Col><h5>{props.props.answer_3_count} entries</h5></Col>
            </Row>
            <Row>
                <Col><h5>2</h5></Col>
                <Col>
                <ProgressBar variant="warning" min={0} max={props.props.total_entries} now={props.props.answer_2_count} />
                </Col>
                <Col><h5>{props.props.answer_2_count} entries</h5></Col>
            </Row>
            <Row>
                <Col><h5>1</h5></Col>
                <Col>
                <ProgressBar variant="danger" min={0} max={props.props.total_entries} now={props.props.answer_1_count} />
                </Col>
                <Col><h5>{props.props.answer_1_count} entries</h5></Col>
            </Row>
            <Row><h4>Average Answer: {props.props.average_answer}/5</h4></Row>
            </Container>
        </>
    )
}