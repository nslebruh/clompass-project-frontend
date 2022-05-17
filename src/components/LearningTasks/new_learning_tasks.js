import React from 'react';
import {Offcanvas, Image, ListGroup, DropdownButton, Dropdown, Button, Stack, Container} from 'react-bootstrap';
import Parse from 'html-react-parser';
import { UpdateDataPage } from '../updateData';
import {
    validateLocalStorageData, 
    getLocalStorageData,
    nameSort,
    dateSort,
    saveLocalStorageData,
} from '../../functions';
const RenderLearningTasksAmount = (props) => {
    let {overdue, late, pending, on_time} = props.status_amounts; 
    return (
        <React.Fragment>
            <Container>
                {`You currently have ${overdue} overdue learning tasks`}
                <br/>
                {`You currently have ${late} late learning tasks`}
                <br/>
                {`You currently have ${pending} pending learning tasks`}
                <br/>
                {`You currently have ${on_time} on time learning tasks`}
                <br/>
            </Container>
        </React.Fragment>
    )
}
const SortMenu = (props) => {
    let updateSort = props.updateSort;
    let classes = props.classes
    let statuses = props.statuses
    return (
        <React.Fragment>
            <DropdownButton id="dropdown-basic-button" title="Sort by">
                <Dropdown.Item onClick={() => updateSort('name')}>Name</Dropdown.Item>
                <Dropdown.Item onClick={() => updateSort('date')}>Date</Dropdown.Item>
            </DropdownButton>
            <br/>
            <DropdownButton id="dropdown-basic-button" title="Filter by">

            </DropdownButton>
        </React.Fragment>
    )
}

const ClompassLearningTask = (props) => {
    let handleOffcanvas = props.handleOffcanvas
    let task = props.task
    let renderType = props.renderType
    let options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"}
    return (
        <React.Fragment>
            <Stack gap={6}>
                <ListGroup.Item as="button" action onClick={() => handleOffcanvas(task.id)}>
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <strong className={`mb-1 ${props.renderType === "overdue" ? "container d-flex align-items-center justify-content-center" : ""}`}>
                            <div>
                                {task.name}
                            </div>     
                        </strong>
                        {renderType === "overdue"
                        ?   null
                        :   <small>
                                Due by {new Date(task.due_date).toLocaleDateString("en-AU", options)}
                            </small>
                        }
                    </div>
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <div className="mb-1">
                            {task.subject_name} - {task.subject_code}
                        </div>
                        {renderType === "overdue" 
                        ?   <small>
                                Due by {new Date(task.due_date).toLocaleDateString("en-AU", options)}
                            </small> 
                        :   <span>
                                <small>
                                    {"Submission Status: " + task.submission_status}
                                </small>
                                <Image src={task.submission_svg_link} alt={task.submission_status} width="25" height="25"/>
                            </span>
                        }
                    </div>
                </ListGroup.Item>
            </Stack>
        </React.Fragment>
    )
}
const ClompassLearningTaskOffCanvas = (props) => {
    let task = props.task
    let show = props.show
    let handleOffcanvas = props.handleOffcanvas
    let options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"}
    return (
        <React.Fragment>
            <Offcanvas show={show} onHide={() => handleOffcanvas(task.id, false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{task.name}</Offcanvas.Title>
            </Offcanvas.Header>
                <Offcanvas.Body>
                    Subject: {task.subject_name} - {task.subject_code}
                    <br/>
                    Submission status: {task.submission_status}
                    <br/>
                    Due date: {new Date(task.due_date).toLocaleDateString("en-US", options)}
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
                        :   task.attachments.map((attachment, index) => (
                                <div key={index}>
                                    <a href={attachment.link}>{attachment.name}</a>
                                    <br/>
                                </div>
                            ))
                    }
                    Submissions: {task.submissions === null 
                        ?   "None" 
                        :   task.submissions.map((submission, index) => (
                            <div key={index}>
                                <a href={submission.link}>{submission.name}</a>
                                <br/>
                            </div>
                            ))
                    }
                </Offcanvas.Body>
            </Offcanvas>
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
        let x = this.convertData({}, this.learning_tasks)
        console.log(x)
        let y;
        this.renderType = this.props.renderType;
        console.log(this.renderType)
        if (this.renderType === "overdue") {
            y = x.filter((element) => {
                return element.submission_status === "Overdue"
            })
        } else {
            y = x
        }
        console.log(y)
        this.learning_tasks_length = Object.keys(this.learning_tasks)
        this.subjects = []
        if (this.learning_tasks_length !== 0) {
            for (var i = 0; i < this.learning_tasks_length.length; i++) {
                if (this.subjects.includes(this.learning_tasks[this.learning_tasks_length[i]].subject)) {
                    this.subjects.push(this.learning_tasks[this.learning_tasks_length[i]].subject)
                }
            }
        }
        this.statuses = ["Pending", "On time", "Recieved late", "Overdue"]
        //this.task_types = ["cat ", "pt", "hw", "sac"]
        this.current_year = new Date().toLocaleDateString("en-AU", {year: 'numeric'})
        this.years = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]
        
        
        this.state = {
            update_data_page: false,
            year: this.current_year,
            sort: {
                name: 0,
                date: 0,
            },
            sort_changed: false,
            show_only: {
                subject: false,
                status: false,
            },
            offcanvas: {},
            data: x,
            sorted_data: y,
            new_data: {},
            old_data: {...this.learning_tasks}
        }
        this.ws = this.props.ws
    }
    handleDataPage = (value) => {
        this.setState({update_data_page: value})
    }
    handleLearningTasks = (value) => {
        let x = this.convertData({...value}, this.state.old_data)
        console.log(x)
        saveLocalStorageData({learning_tasks: {...value, ...this.state.old_data}})
        this.setState({new_data: {...value}, data: x, sorted_data: x})
    }
    handleOffcanvas = (id, value=true) => {
        if (value === true) {
            this.setState({offcanvas: {[id]: true}})
        } else {
            this.setState({offcanvas: {[id]: false}})
        }
        
    }
    convertData = (new_data, old_data ) => {
        let d;
        let x = [];
        let data = {...old_data, ...new_data}
        d = Object.keys(data);
        d.forEach(element => {
            x.push(data[element])
        })
        return x
    }
    updateShowBy = () => {
        
    }
    updateSort = (new_sort) => {
        let sort_x = this.state.sort[new_sort] === 0 ? 1 : this.state.sort[new_sort] === 1 ? 2 : 0;
        this.setState({new_sort: null, sort: {...this.state.sort, [new_sort]: sort_x}, sort_changed: true})
    }
    sortData = (sort, data) => {
        let keys = Object.keys(sort)
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            switch (sort[key]) {
                case "name":
                    data = nameSort(data, sort["name"])
                    break;
                case "date":
                    data = dateSort(data, sort["date"])
                    break;
                default:
                    break;
            }
        }
        this.setState({sorted_data: data, sort_changed: false})
    }
    render() {
        if (this.state.sort_changed !== false) {
            this.sortData(this.state.new_sort, this.state.sort, this.state.data)
        }
        return (
            <React.Fragment>
                {this.props.renderType === "overdue"
                ?   null 
                :   <React.Fragment>
                        <UpdateDataPage ws={this.ws} setDataPage={this.handleDataPage} setLearningTasks={this.handleLearningTasks} state={this.state.update_data_page} type="learningtasks" />
                        <Button type="button" onClick={() => this.setState({update_data_page: true})}>Update Data</Button>
                        <RenderLearningTasksAmount status_amounts={this.status_amounts} />
                        <SortMenu updateSort={this.updateSort} subjects={this.subjects} statuses={this.statuses}/>
                    </React.Fragment>
                }
                <React.Fragment>
                    <ListGroup variant="flush" className="scrollarea">
                        {this.state.sorted_data.map((task, index) => (
                            <ClompassLearningTask task={task} key={index} handleOffcanvas={this.handleOffcanvas} renderType={this.renderType}/>
                        ))}
                    </ListGroup>
                    {this.state.sorted_data.map((task, index) => (
                        <ClompassLearningTaskOffCanvas task={task} key={index} handleOffcanvas={this.handleOffcanvas} show={this.state.offcanvas[task.id]}/>
                    ))}
                </React.Fragment>
            </React.Fragment>
        )
    }
}