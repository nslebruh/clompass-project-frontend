import {Row, Col} from "react-bootstrap"
import {Schedule} from "../Schedule"
import {LearningTasks} from "../LearningTasks"
const Dashboard = (props) => {
    return (                      
        <>
            <Row>
              <Col xs={4} className="text-center">
                <h1>Today's Schedule</h1>
                <Schedule onlyDayView="true" ws={props.ws}/>
              </Col>
              <Col xs={5} className="text-center">
                <h1>Overdue learning tasks</h1> 
                <LearningTasks renderType="overdue" ws={props.ws}/>
              </Col>
              <Col className="text-center">
                <h1>Disclaimer:</h1>
                  <p>
                    This is a prototype for a learning management system.
                    It is not intended to be a full-featured learning management system.
                    This is still in development and may be subject to change. 
                    Any data submitted is not collected or stored. 
                    The source code is linked below:
                    <br/>
                    <a href="https://github.com/nslebruh/clompass-project-backend">Backend Server</a>
                    <br/>
                    <a href="https://github.com/nslebruh/clompass-project-frontend">Frontend Website</a>
                    <br/>
                  </p>
              </Col>
            </Row>

    </>
    )
}
export default Dashboard