import React from 'react';
import {Offcanvas, Image, ListGroup, DropdownButton, Dropdown, Button, Stack, Container} from 'react-bootstrap';
import Parse from 'html-react-parser';
import { UpdateDataPage } from '../updateData';
import { validateLocalStorageData, getLocalStorageData } from '../../functions';
const RenderLearningTasksAmount = (props) => {
    return (
        <React.Fragment>
            <Container>
                {`You currently have ${props.overdue} overdue learning tasks`}
                <br/>
                {`You currently have ${props.late} late learning tasks`}
                <br/>
                {`You currently have ${props.pending} pending learning tasks`}
                <br/>
                {`You currently have ${props.on_time} on time learning tasks`}
                <br/>
            </Container>
        </React.Fragment>
    )
}
export default class LearningTasks extends React.Component {
    constructor(props) {
        super(props);
        this.status_amounts = {
            overdue: 0,
            on_time: 0,
            late: 0,
            pending: 0
        }
        this.learning_tasks = getLocalStorageData("learning_tasks")
        //this.statuses = ["Pending", "On time", "Recieved late", "Overdue"]
        //this.task_types = ["cat ", "pt", "hw", "sac"]
        //this.date_options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"}
        //this.classes = {all: "all"}
        this.renderType = props.renderType;
        this.current_year = new Date().toLocaleDateString("en-AU", {year: 'numeric'})
        this.years = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]
        this.state = {
            update_data_page: false,
            year: this.current_year,
            new_sort: null,
            sort: {
                name: 0,
                date: 0,

            },
            show_only: {},
            offcanvas: {},
            data: [],
            any_new_data: false,
            new_data: {},
            old_data: {}
        }
        this.ws = this.props.ws
    }
    handleDataPage = (value) => {
        this.setState({update_data_page: value})
    }
    handleLearningTasks = (value) => {
        this.setState({new_data: {...value}})
    }
    convertData = (new_data, old_data ) => {
        let d;
        let x = [];
        let data = {...old_data, ...new_data}
        d = Object.keys(data);
        d.forEach(element => {
            x.push(data[element])
        })
        this.setState({
            new_data: {},
            old_data: data,
            data: x
        })
    }
    renderTasks = (data, renderType) => {
        let tasks;
        return (
            <React.Fragment>
                {tasks.data.length <= 0 
                ? "No tasks" 
                :   <React.Fragment>
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
                                        ?   <React.Fragment>
                                                Description: {Parse(task.description)}
                                                <br/>
                                            </React.Fragment> 
                                        :   <br/>
                                    }
                                    Attachments: {task.attachments === null 
                                        ?   <React.Fragment>
                                                None
                                                <br/>
                                            </React.Fragment> 
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
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
    render() {
        //if (this.state.new_data !== {}) {
        //    this.convertData(this.state.new_data, this.state.old_data)
        //}
        //if (this.state.new_sort !== null) {
        //    this.sortData(this.state.data)
        //}
        let data = this.state.data 
        return (
            <React.Fragment>
                {this.props.renderType === "overdue"
                ?   null 
                :   <React.Fragment>
                        <UpdateDataPage ws={this.ws} setDataPage={this.handleDataPage} setLearningTasks={this.handleLearningTasks} state={this.state.update_data_page} type="learningtasks" />
                        <Button type="button" onClick={() => this.setState({update_data_page: true})}></Button>
                        <RenderLearningTasksAmount overdue={this.status_amounts.overdue} on_time={this.status_amounts.on_time} late={this.status_amounts.late} pending={this.status_amounts.pending} />
                    </React.Fragment>
                }
                help
            </React.Fragment>
        )
    }
}