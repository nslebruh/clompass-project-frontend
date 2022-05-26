import React from "react";
import { Container, Row, Col } from "react-bootstrap"

import Chronicles from "./Chronicles";
export default class StudentInfo extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
    }
    render() {
        return (
            <Container>
                {this.props.data === [] ? <>No student info</> : 
                <Row>
                <Col>
                    <h1>Profile</h1>
                    Name: {this.props.data.name}
                    <br/>
                    Prefered name: {this.props.data.prefered_name}
                    <br/>
                    House: {this.props.data.house}
                    <br/>
                    Form: {this.props.data.form}
                    <br/>
                    id: {this.props.data.school_id}
                    <br/>
                    <img src={this.props.data.image} alt={"this an img"}/>
                </Col>
                <Col>
                    <Chronicles data={this.data.chronicles}/>
                </Col>
            </Row>}
                
            </Container>
        )
    }
}