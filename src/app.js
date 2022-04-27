import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import { Navbar, Nav, Form, Button, Offcanvas, Image, Container, Row, Col, Spinner, Stack } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import ICalParser from 'ical-js-parser';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Dashboard from "./components/dashboard.js";
import LearningTasks from "./components/learning_tasks.js";
import Schedule from "./components/schedule.js";
import StudentInfo from "./components/student_info.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            learning_tasks_format_data: "",
            year: '',
            username: '',
            password: '',
            learning_tasks: true,
            student_info: false,
            update_data_page: false,
            schedule_data: [],
            data: {
                student_info: JSON.parse(localStorage.getItem('clompass-data')).student_info ? JSON.parse(localStorage.getItem('clompass-data')).student_info : {},
                learning_tasks: JSON.parse(localStorage.getItem('clompass-data')).learning_tasks ? JSON.parse(localStorage.getItem('clompass-data')).learning_tasks : [],
                schedule_url: JSON.parse(localStorage.getItem('clompass-data')).schedule_url ? JSON.parse(localStorage.getItem('clompass-data')).schedule_url : '',
            },
        };
    }
    async componentDidMount() {
        console.log("component mounted")
        if (localStorage.getItem('clompass-data') === null) {   
            localStorage.setItem('clompass-data', '{"learning_tasks":[],"student_info":{},"schedule_url":""}')
        }
        if (this.state.data.schedule_url !== "") {
            this.fetchSchedule(this.state.data.schedule_url)
        }
        return
        

    }
    fetchSchedule = async (url) => {
        const response = await fetch(url)
        let data = await response.blob();
        data = await data.text();
        const ics = ICalParser.toJSON(data);
        const d = [];
        for (let i = 0; i < ics.events.length; i++) {
          d.push({
            startDate: this.parseTime(ics.events[i].dtstart.value),
            endDate: this.parseTime(ics.events[i].dtend.value),
            title: ics.events[i].summary + ' - ' + ics.events[i].location + ' - ' + ics.events[i].description.split(' : ')[1],
          })
        }
        this.setState({
            schedule_data: d
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
    fetchApi = async () => {
        let response = await fetch(`http://clompass-backend.herokuapp.com/puppeteer?username=${this.state.username}&password=${this.state.password}&student_info=${this.state.student_info}`)
        response = await response.json();
        console.log(response)
        this.setState({data: {
            ...this.state.data,
            learning_tasks: response.learning_tasks[2022],
            Student_info: response.student_info,
        }})
    }
    showOffcanvas() {
        this.setState({update_data_page: true})
    }
    saveData() {
        let data = {};
        data.learning_tasks = this.state.data.learning_tasks
        data.student_info = this.state.data.student_info
        data.schedule_url = this.state.data.schedule_url
        localStorage.setItem('clompass-data', JSON.stringify(data))
    }
    changeTF(status, state) {
        let x = status === true ? false : true
        this.setState({[state]: x})
    }

    formatLearningTasks(body) {
        let data = [];
        let responsebody = JSON.parse(body).d.data;
        for (let i = 0; i < responsebody.length; i++) {
            let task = responsebody[i];
            let name = task.name;
            let subject_name = task.subjectName;
            let subject_code = task.activityName;
            let attachments = [];
            let submissions = [];
            let description = task.description;
            let official_due_date = task.dueDateTimestamp;
            let individual_due_date = task.students[0].dueDateTimestamp;
            individual_due_date ? individual_due_date = individual_due_date : individual_due_date = official_due_date;
            let submission_status;
            let submission_svg_link;
            if (task.students[0].submissionStatus === 1) {
                submission_status = "Pending";
                submission_svg_link = "https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/task-status/pending.svg";
              } else if (task.students[0].submissionStatus === 2) {
                submission_status = "Overdue";
                submission_svg_link = "https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/task-status/overdue.svg";
              } else if (task.students[0].submissionStatus === 3) {
                submission_status = "On time";
                submission_svg_link = "https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/task-status/ontime.svg"
              } else if (task.students[0].submissionStatus === 4) {
                submission_status = "Recieved late";
                submission_svg_link = "https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/task-status/receivedlate.svg";
              } else {
                submission_status = "Unknown"
              }
            if (task.attachments != null) {
                for (let j = 0; j < task.attachments.length; j++) {
                    attachments.push({attachment_name: task.attachments[j].name, attachment_link: "https://lilydaleheights-vic.compass.education/Services/FileAssets.svc/DownloadFile?id=" + task.attachments[j].id + "&originalFileName=" + task.attachments[j].fileName.replace(/ /g, "%20"),});
                }
              } else {
                attachments = "None";
              }
            
            if (task.students[0].submissions != null) {
              for (let j = 0; j < task.students[0].submissions.length; j++) {
                    submissions.push({submission_name: task.students[0].submissions[j].fileName, submission_link: "https://lilydaleheights-vic.compass.education/Services/FileDownload/FileRequestHandler?FileDownloadType=2&taskId=" + task.students[0].taskId + "&submissionId=" + task.students[0].submissions[j].id});
              }
            }
            data.push({name: name, subject_name: subject_name, subject_code: subject_code, attachments: attachments, description: description, official_due_date: official_due_date, individual_due_date: individual_due_date, submission_status: submission_status, submissions: submissions, submission_svg_link: submission_svg_link, id: id});
            id++; 
        }
        this.setState({data: {
            ...this.state.data,
            learning_tasks: data,
            }
        })
    }

    navbar() {
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
                        <LinkContainer to="/student">
                            <Nav.Link>Profile</Nav.Link>
                        </LinkContainer>
                        <Nav.Link onClick={() => this.showOffcanvas()}>Update data</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
        )     
    }
    update_data_page() {
        return (
            <>
                <Offcanvas show={this.state.update_data_page} onHide={() => this.setState({update_data_page: false})}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Update Data</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form>
                            <Form.Label>
                                Input learning tasks response data
                            </Form.Label>
                            <Form.Control type="text" placeholder="Data" name="learning_tasks_format_data" onChange={(e) => this.setState({[e.target.name]: e.target.value})}/>
                            <Button type="button" onClick={() => this.formatLearningTasks(this.state.learning_tasks_format_data)}>Format learning tasks data</Button>
                        </Form>
                        <Form>
                            <Form.Label>Input new schedule URL</Form.Label>
                            <Form.Control type='text' placeholder='URL' name='new_schedule_url' id='url' onChange={(event) => this.setState({data: {...this.state.data, schedule_url: event.target.value}})}></Form.Control>
                            <Button onClick={() => this.fetchSchedule(this.state.data.schedule_url)}>Get schedule data</Button>
                            <br/>
                            <Form.Label>Input Username</Form.Label>
                            <Form.Control type='text' placeholder='Username' name="username" id='username' onChange={(event) => this.setState({[event.target.name]: event.target.value})}></Form.Control>
                            <br/>
                            <Form.Label>Input Password</Form.Label>
                            <Form.Control type='password' placeholder='Password' name="password" id='password' onChange={(event) => this.setState({[event.target.name]: event.target.value})}></Form.Control>
                            <br/>
                            <Form.Label>Input Year</Form.Label>
                            <Form.Control type='text' placeholder='2022' name="year" id="year" onChange={(event) => this.setState({[event.target.name]: event.target.value})}></Form.Control>
                            <Button onClick={() => this.fetchApi()}>Get API data</Button>
                            <br/>
                            <Button onClick={() => this.changeTF(this.state.learning_tasks, "learning_tasks")}>Learning tasks: {this.state.learning_tasks}</Button> 
                            <Button onClick={() => this.changeTF(this.state.student_info, "student_info")}>Student info: {this.state.student_info}</Button> 
                            <Button onClick={() => this.saveData()}>Save new data</Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        )
    }
    render() {
        return (
            <Router>
                {this.navbar()}
                {this.update_data_page()}
                <Routes>
                    <Route path="/" element={<Dashboard data={this.state.data} />} />
                    <Route path="/learning-tasks" element={<LearningTasks data={this.state.data.learning_tasks}/>} />
                    <Route path="/schedule" element={<Schedule data={this.state.schedule_data} />} />
                    <Route path="/student" element={<StudentInfo data={this.state.data.student_info}/>} />
                </Routes>
            <h1>Hello World</h1>
            </Router>
        )
    }
}