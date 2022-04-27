import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import { Navbar, Nav, Form, Button, Offcanvas, Image, Row, Col, Spinner, } from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";
import "./scss/app.scss"
import ICalParser from 'ical-js-parser';
import {io} from "socket.io-client"

import PageNotFound from "./components/page_not_found.js"
//import LearningTasks from "./components/learning_tasks.js";
import LearningTasks from "./components/new_learning_tasks";
//import Schedule from "./components/schedule.js";
import Schedule from "./components/new_schedule.js";
import StudentInfo from "./components/student_info.js";
import MyTasks from "./components/mytasks.js"
import Subjects from "./components/subjects.js"
import Subject from "./components/subject.js"
import Error from "./components/error.js"
import Settings from "./components/settings.js"

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.data = {};
        this.schedule_url = ""
        this.learning_tasks = {}
        this.schedule_data = {}
        this.student_info = {chronicles:{}}

        try {
            this.data = localStorage.getItem("clompass-data")
            if (this.data !== null) {
                try {
                    this.data = JSON.parse(this.data)
                } catch (e) {
                    console.log(e)
                    let clompassData = {
                        timestamp: new Date(),
                        schedule_url: "",
                        schedule_data: {},
                        learning_tasks: {},
                        subjects: {},
                        student_info: {
                            chronicles: {}
                        },
                    }
                    localStorage.clear()
                    localStorage.setItem("clompass-data", JSON.stringify(clompassData))
                } 
                if (!this.data.timestamp || new Date(this.data.timestamp).valueOf() <= 1651017600000) {
                    let clompassData = {
                        timestamp: new Date(),
                        schedule_url: "",
                        schedule_data: {},
                        learning_tasks: {},
                        subjects: {},
                        student_info: {
                            chronicles: {}
                        },
                    }
                    localStorage.clear()
                    localStorage.setItem("clompass-data", JSON.stringify(clompassData))
                }
            }
        } catch (error) {
            console.log(error)
        }
        console.log(this.data)
        this.state = {
            fetching_api_data: false,
            api_message: [],
            month: 2,
            year: new Date().getFullYear(), 
            username: '',
            api_fetch_error: null,
            password: '',
            update_data_page: false,
            get_type: "learningtasks",
            data: {
                schedule_url: this.schedule_url,
                schedule_data: this.schedule_data,
                learning_tasks: this.learning_tasks,
                subjects: this.subjects,
                student_info: this.student_info,

            },
            settings: {},
            
        };

        this.ws = io("https://api.clompass.com/get", {transports: ["websocket"]})
        //this.ws = io("http://localhost:3001/get", {transports: ["websocket"]}) // connect to development server 
        this.subjects = this.state.data.subjects !== {} ? Object.keys(this.state.data.subjects) : null
        this.years = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]
    }
    handleSingleStateChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    async componentDidMount() {
        console.log("component mounted")
        this.ws = this.ws.connect()
        this.ws.on("connect", () => {
            console.log("connected to webSocket")
        })
        this.ws.on("disconnect", () => {
            console.log("disconnected from webSocket")
        })
        this.ws.on("message", (status_code, timestamp, message) => {
            console.log(timestamp, message)
            this.setState({api_message: [...this.state.api_message, {timestamp: timestamp, message: message, status_code: status_code}]})
        })
        this.ws.on("data", (status_code, timestamp, message, response_type, response_data) => {
            console.log(status_code, message, response_type)
            console.log(response_data)
            let data;
            if (response_type === "learning_tasks" || response_type === "schedule_data") {
                data = {...this.state.data[response_type], ...response_data}
            } else {
                data = response_data
            }
            
            this.setState({
                api_message: [{status_code: status_code, message: message, timestamp: timestamp}],
                fetching_api_data: false,
                data: {
                    ...this.state.data,
                [response_type]: data
                }
            })
            return
        })
        this.ws.on("error", (status_code, timestamp, message, error) => {
            console.log(status_code, message, error)
            this.setState({api_message: [{timestamp: timestamp, status_code: status_code, message: `${message}: ${error}`}], api_fetch_error: error, fetching_api_data: false})
        })
        this.ws.on("lesson_plan", (lesson_plan_object) => {
            this.setState({
                data: {
                    ...this.state.data,
                    subjects: {
                        ...this.state.data.subjects,
                        [lesson_plan_object.subject_id]: {
                            lessons: {
                                ...this.state.data.subjects[lesson_plan_object.subject_id].lessons,
                                [lesson_plan_object.node_id]: {
                                    ...this.state.data.subjects[lesson_plan_object.subject_id].lessons[lesson_plan_object.node_id],
                                    lesson_plan: lesson_plan_object.plan

                                }
                            }
                        }
                    }
                }
            })
        })
        if (this.state.data.schedule_url !== "") {
            await this.fetchSchedule(this.state.data.schedule_url)
        }
        return
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        this.ws.disconnect();
    }
    tick() {
        this.setState({
          time: new Date()
        });
      }
    fetchSchedule = async (url) => {
        const response = await fetch(url)
        let d = {};
        try {
            let data = await response.blob();
            data = await data.text();
            const ics = ICalParser.toJSON(data);
            console.log(ics)
            for (let i = 0; i < ics.events.length; i++) {
              d[ics.events[i].uid.split("@")[0]] = {
                startDate: this.parseTime(ics.events[i].dtstart.value),
                uid: ics.events[i].uid.split("@")[0],
                formattedStart: new Date(this.parseTime(ics.events[i].dtstart.value)).toLocaleTimeString("us-en", { hour: 'numeric', minute: 'numeric', hour12: true }),
                endDate: this.parseTime(ics.events[i].dtend.value),
                formattedEnd: new Date(this.parseTime(ics.events[i].dtend.value)).toLocaleTimeString("us-en", { hour: 'numeric', minute: 'numeric', hour12: true }),
                subject: ics.events[i].summary,
                room: ics.events[i].location !== "" ? ics.events[i].location : "No room",
                teacher: ics.events[i].description.split(' : ')[1],
                text: ics.events[i].summary + ' - ' + (ics.events[i].location !== "" ? ics.events[i].location : "No room") + ' - ' + ics.events[i].description.split(' : ')[1],
              }
            }
        } catch (error) {
            console.log(error)
        }
        
        this.setState({
            data: {
                ...this.state.data, 
                schedule_data: {
                    ...this.state.data.schedule_data, ...d
                }
            } 
        })
    }
    parseTime(string) {
        return new Date(
            [
              string.slice(0, 4) + "-",
              string.slice(4, 6) + "-",
              string.slice(6, 8) + "T",
              string.slice(9, 11) + ":",
              string.slice(11, 13) + ":",
              string.slice(13, 15) + "Z",
            ].join(""),
        ).valueOf();
    }
    parseTimeString(string) {
        return new Date(
            [
              string.slice(0, 4) + "-",
              string.slice(4, 6) + "-",
              string.slice(6, 8) + "T",
              string.slice(9, 11) + ":",
              string.slice(11, 13) + ":",
              string.slice(13, 15) + "Z",
            ].join(""),
        )
    }      
    saveData() {
        let data = {};
        Object.keys(this.state.data).forEach(key => {
            data[key] = this.state.data[key]
        })
        console.log(JSON.stringify(data))
        localStorage.setItem('clompass-data', JSON.stringify(data))
    }
    navbar = () => {
        return (
            <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand>
                    <Image src="https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/icon.svg" fluid height="48" width="60"/> Clompass
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Dashboard</Nav.Link>
                        </LinkContainer>
                        <Nav.Link as="a" href="https://outlook.com/lilydaleheights.vic.edu.au" target="_blank" rel="noopener">Emails</Nav.Link>
                        <LinkContainer to="/learning-tasks">
                            <Nav.Link>Learning Tasks</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/schedule">
                            <Nav.Link>Schedule</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/subjects">
                            <Nav.Link>Subjects</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/student">
                            <Nav.Link>Profile</Nav.Link>
                        </LinkContainer>
                        <Nav.Link onClick={() => this.setState({update_data_page: true})}>Update data</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
     )     
    }
    sendEmit = (type, username, password, year, month) => {
        this.setState({fetching_api_data: true, api_message: [], api_fetch_error: null})
        this.ws.emit(type, username, password, year, month)
    }
    sendLessonPlans = (subject) => {
        let lessons = {}
        for (let x = 0; x < Object.keys(this.state.data.subjects[subject].lessons).length; x++) {
            let data = this.state.data.subjects[subject].lessons[x]
            if (data.plan !== null) {
                if (!data.plan.string) {
                    lessons[data.uuid] = data
                }
            }
        }
        this.ws.emit("lessonplans", lessons)
    }
    update_data_page() {
        return (
            <>
                <Offcanvas show={this.state.update_data_page} onHide={() => this.setState({update_data_page: false})}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Update Data</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Button onClick={() => this.saveData()}>Save data to local storage</Button>
                        <Form>
                            <Form.Label>Input Username</Form.Label>
                            <Form.Control type="text" placeholder="username" name="username" id="username" onChange={(event) => this.setState({[event.target.name]: event.target.value})} />
                            <br/>
                            <Form.Label>Input Password</Form.Label>
                            <Form.Control type="password" placeholder="password" name="password" id="password" onChange={(event) => this.setState({[event.target.name]: event.target.value})} />
                            <Button type="button" onClick={() => this.setState({get_type: "learningtasks"})}>learning tasks {this.state.get_type === "learningtasks" ? "tick" : null}</Button>
                            {this.state.get_type === "learningtasks" ? <><br/>{this.years.map((year, index) => (
                                <Button key={index} type="button" onClick={() => this.setState({year: year})}>{year} {this.state.year === year ? "tick" : null}</Button>
                            ))}<br/></> : null}
                            <Button type="button" onClick={() => this.setState({get_type: "studentinfo"})}>Student info {this.state.get_type === "studentinfo" ? "tick" : null}</Button>
                            <Button type="button" onClick={() => this.setState({get_type: "schedule"})}>Schedule {this.state.get_type === "schedule" ? "tick" : null}</Button>
                            <Button type="button" onClick={() => this.setState({get_type: "subjects"})}>Subjects {this.state.get_type === "subjects" ? "tick" : null}</Button>
                            <Button type="button" onClick={() => this.setState({get_type: "getcalender"})}>Getcalender {this.state.get_type === "getcalender" ? "tick" : null}</Button>

                            <br/>
                            {this.state.fetching_api_data ? <Button disabled><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button> : <Button type="button" onClick={() => this.sendEmit(this.state.get_type, this.state.username, this.state.password, this.state.year, this.state.month)}>Get data</Button>}
                        </Form>
                        {this.subjects === null 
                            ?   "no subject data" 
                            :   <Form>
                                    <Form.Label>Choose subject</Form.Label>
                                    {this.subjects.map((subject, index) => (
                                        <Button key={index} type="button" onClick={() => this.setState({lesson_plan_subject: subject})}>{subject}</Button>
                                    ))}
                                    <Button type="button" onClick={() => this.sendLessonPlans(this.state.subject)}></Button>
                                </Form>
                            }
                        {this.state.api_message.map((message, index) => (
                            <p key={index}>
                                {message.timestamp}: {message.status_code} - {message.message}
                            </p>
                        ))}
                        {this.state.api_fetch_error ? <h1>Error: {this.state.api_fetch_error}</h1> : null}
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        )
    }
    dashboard = () => {
        return (
            <>
                <Row>
                <Col className="text-center">
                    <h1>Today's Schedule</h1>
                    <Schedule onlyDayView="true" data={this.state.data.schedule_data}/>
                  </Col>
                  <Col className="text-center">
                    <h1>Overdue learning tasks</h1> 
                    <LearningTasks renderType="overdue" data={this.state.data.learning_tasks}/>
                  </Col>
                  <Col className="text-center">
                    <h1>My Tasks</h1>
                    <MyTasks />
                  </Col>
                </Row>

        </>
        )
    }
    render() {
        return (
            <Router>
                {this.navbar()}
                {this.update_data_page()}
                <Routes>
                    <Route path="/" element={this.dashboard()} />
                    <Route path="/learning-tasks" element={<LearningTasks data={this.state.data.learning_tasks}/>} />
                    <Route path="/schedule" element={<Schedule data={this.state.data.schedule_data} />} />
                    <Route path="/student" element={<StudentInfo data={this.state.data.student_info}/>} />
                    <Route path="/subjects" element={<Subjects data={this.state.data.subjects}/>}/>
                    <Route path="/subject/:subjectCode" element={<Subject data={this.state.data.subjects}/>} />
                    <Route path="/error" element={<Error />} />
                    <Route path="/settings" element={<Settings setState={this.handleSingleStateChange}/>} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'));