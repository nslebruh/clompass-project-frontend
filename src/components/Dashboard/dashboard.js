import {Row, Col} from "react-bootstrap"
import {Schedule} from "../Schedule"
import {LearningTasks} from "../LearningTasks"
import {MyTasks} from "../MyTasks/"
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
                <h1>My Tasks</h1>
                <MyTasks />
              </Col>
            </Row>

    </>
    )
}
export default Dashboard