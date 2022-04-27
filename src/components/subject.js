import React from "react";
import {useParams, useNavigate} from "react-router-dom"
//import parse from "html-react-parser"
import { Container, Col, Row, ListGroup, Stack } from "react-bootstrap"
const withRouter = WrappedComponent => props => {
    const params = useParams();
    const navigate = useNavigate();

    return (
        <WrappedComponent
            {...props}
            params={params}
            navigate={navigate}
        />
    );
};

class Subject extends React.Component {
    constructor(props) {
        super(props)
        this.subject = null
        if (this.props.data !== null && this.props.params !== null) {
            if (this.props.params in this.props.data) {
                this.subject = this.props.data[this.props.params]
            }
        }
    }
    render() {
        return (
            <>
                {this.subject === null
                ?   <h1>Not your subject</h1>
                :   <>
                            <Row>
                                <Col className="text-center col-3">
                                    <Container>
                                        <h1>
                                            Teacher: <br/> {this.subject.teacher} - {this.subject.teacher_code} <br/>
                                            <img src={this.subject.teacher_image_url} alt={this.subject.teacher}/>
                                        </h1>
                                    </Container>
                                </Col>
                                <Col className="text-center">
                                    <Container>
                                        {this.state.current_lesson_plan}
                                    </Container>
                                </Col>
                                <Col className="text-center">
                                    <Container>
                                        <h1>List of lesson plans</h1>
                                        <ListGroup variant="flush" className="scrollarea">
                                        {this.subject.lessons.map((lesson, index) => (
                                            <Stack gap={6} key={index}>
                                                <ListGroup.Item as="button" action onClick={() => this.setState({current_lesson_plan_key: lesson.key, fetching_lesson_plan: true})}>
                                                <div className="d-flex w-100 align-items-center justify-content-between">
                                                    <strong className="mb-1">
                                                        {new Date(lesson.start).toLocaleDateString("en-US", {weekday: "long", year: 'numeric', month: 'long', day: 'numeric'})} at {new Date(lesson.start).toLocaleTimeString("en-US", {hour: 'numeric', minute: 'numeric'})} to {new Date(lesson.end).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"})}
                                                    </strong>
                                                </div>
                                                </ListGroup.Item>
                                            </Stack>
                                        ))}
                                        </ListGroup>
                                    </Container>
                                </Col>
                            </Row>
                        
                        

                    </>
                }
            </>
        )
    }
}
export default withRouter(Subject)