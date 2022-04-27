import React from 'react';
import {Offcanvas, Image, ListGroup, DropdownButton, Dropdown, Button, Stack, Container} from 'react-bootstrap';
import Parse from 'html-react-parser';

export default class LearningTasks extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
        this.statuses = ["Pending", "On time", "Recieved late", "Overdue"]
        this.task_types = ["cat ", "pt", "hw", "sac"]
        this.date_options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"}
        this.classes = {all: "all"}
        this.renderType = props.renderType;
        this.current_year = new Date().toLocaleDateString("en-AU", {year: 'numeric'})
        this.keys = Object.keys(props.data)
        for (var l = 0; l < this.keys.length; l++) {
            this.data.push(props.data[this.keys[l]])
        }
        for (l = 0; l < this.keys.length; l++) {
            if (props.data[this.keys[l]].year in Object.keys(this.classes) === false) {
                this.classes[props.data[this.keys[l]].year] = []
            }
        }
        for (l = 0; l < this.keys.length; l++) {
            if (this.classes[props.data[this.keys[l]].year].includes(props.data[this.keys[l]].subject_code) === false) {
                this.classes[props.data[this.keys[l]].year].push(props.data[this.keys[l]].subject_code)
            }
        }
        this.state = {
            year: this.current_year,
            sort_by: {
                name: 0,
                date: 0,

            },
            show_only: {},
            offcanvas: {},
        }
    }
    sortTasks = (renderType, data, sort_object, show_object) => {
        let tasks = {
            submission_status_totals: {
                overdue: 0,
                pending: 0,
                late: 0,
                on_time: 0,
            },
            data: []
        }
        if (renderType === "overdue") {
            tasks.data = data.filter(i => {
                return i.submission_status === "Overdue" && i.year === this.current_year 
            })
            return tasks
        }
        if (this.state.year === "all_years") {
            for (var i = 0; i < data.length; i++) {
                switch (data[i].submission_status) {
                    case "Overdue":
                        tasks.submission_status_totals.overdue++
                        break;
                    case "Pending":
                        tasks.submission_status_totals.pending++
                        break;
                    case "Recieved late":
                        tasks.submission_status_totals.late++
                        break;
                    case "On time":
                        tasks.submission_status_totals.on_time++
                        break;
                    default:
                        break;
                }
            }
            
        } else {
            for (i = 0; i < data.length; i++) {
                console.log(data[i].year)
                if (data[i].year === this.state.year) {
                    switch (data[i].submission_status) {
                        case "Overdue":
                            tasks.submission_status_totals.overdue++
                            break;
                        case "Pending":
                            tasks.submission_status_totals.pending++
                            break;
                        case "Recieved late":
                            tasks.submission_status_totals.late++
                            break;
                        case "On time":
                            tasks.submission_status_totals.on_time++
                            break;
                        default:
                            break;
                    }
                }  
            }
            
        }
        tasks.data = data
        return tasks
    }
    renderTasks = (data, renderType) => {
        let tasks = this.sortTasks(renderType, data, this.state.sort_by, this.state.show_only)
        return (
            <>
                {renderType === "overdue" 
                    ?   null 
                    :   <>
                            <Container>
                                {`You currently have ${tasks.submission_status_totals.overdue} overdue learning tasks`}
                                <br/>
                                {`You currently have ${tasks.submission_status_totals.late} late learning tasks`}
                                <br/>
                                {`You currently have ${tasks.submission_status_totals.pending} pending learning tasks`}
                                <br/>
                                {`You currently have ${tasks.submission_status_totals.on_time} on time learning tasks`}
                                <br/>
                            </Container>
                        </> 
                }
                {tasks.data.length <= 0 
                ? "No tasks" 
                :   <>
                        <ListGroup variant="flush" className="scrollarea">
                            {tasks.data.map((task, index) => (
                                <Stack gap={6} key={index}>
                                    <ListGroup.Item as="button" action onClick={() => this.setState({offcanvas: {[task.id]: true}})} key={index}>
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <strong className="mb-1">
                                                {task.name}
                                              </strong>
                                            {renderType === "overdue"
                                            ?   null
                                            :   <small>
                                                    Due by {new Date(task.due_date).toLocaleDateString("en-AU", this.options)}
                                                </small>}
                                        </div>
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <div className="mb-1">
                                                {task.subject_name} - {task.subject_code}
                                            </div>
                                            {renderType === "overdue" 
                                            ?   <small>
                                                    Due by {new Date(task.due_date).toLocaleDateString("en-AU", this.options)}
                                                </small> 
                                            :   <span>
                                                    <small>
                                                        {"Submission Status: " + task.submission_status}
                                                    </small>
                                                    <Image src={task.submission_svg_link} alt={task.submission_status} width="25" height="25"/>
                                             </span>}
                                        </div> 
                                    </ListGroup.Item>
                                </Stack>
                            ))}
                        </ListGroup>
                        {tasks.data.map((task, index) => 
                            <Offcanvas show={this.state.offcanvas[task.id]} onHide={() => this.setState({offcanvas: {[task.id]: false}})} key={index}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>{task.name}</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    Subject: {task.subject_name} - {task.subject_code}
                                    <br/>
                                    Submission status: {task.submission_status}
                                    <br/>
                                    Due date: {new Date(task.due_date).toLocaleDateString("en-US", this.options)}
                                    <br/>
                                    <br/>
                                    {task.description !== null 
                                        ?   <>
                                                Description: {Parse(task.description)}
                                                <br/>
                                            </> 
                                        :   <br/>
                                    }
                                    Attachments: {task.attachments === null 
                                        ?   <>
                                                None
                                                <br/>
                                            </> 
                                        :   task.attachments.map((attachment, index) => 
                                                <div key={index}>
                                                    <a href={attachment.link}>{attachment.name}</a>
                                                    <br/>
                                                </div>
                                    )}
                                    Submissions: {task.submissions === null 
                                    ? "None" 
                                    : task.submissions.map((submission, index) => (
                                        <div key={index}>
                                            <a href={submission.link}>{submission.name}</a>
                                            <br/>
                                        </div>
                                    ))}
                                </Offcanvas.Body>
                            </Offcanvas>
                )}
                    </>
                }
                
            </>
        )
    }
    render() {
        return (
            <>
                {this.renderTasks(this.data, this.renderType)}
            </>
        )
    }
}