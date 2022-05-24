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
    showOnlySubject,
    showOnlyStatus,
    showOnlyYear,
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
    let subjects = props.subjects
    let statuses = props.statuses
    return (
        <React.Fragment>
            <DropdownButton id="dropdown-basic-button" title="Sort by">
                <Dropdown.Item onClick={() => updateSort('name')}>Name</Dropdown.Item>
                <Dropdown.Item onClick={() => updateSort('date')}>Date</Dropdown.Item>
            </DropdownButton>
            Filter by: 
            <DropdownButton id="dropdown-basic-button" title="Subjects">
                {subjects.map((subject, index) => (
                    <Dropdown.Item as={Button} onClick={() => updateSort(subject, "subject")} key={index}>{subject}</Dropdown.Item>
                ))
                }
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="Status">
                {statuses.map((status, index) => (
                    <Dropdown.Item onClick={() => updateSort(status, "status")} key={index}>{status}</Dropdown.Item>
                ))}
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
        validateLocalStorageData()
        this.status_amounts = {
            overdue: 0,
            on_time: 0,
            late: 0,
            pending: 0
        }
        this.learning_tasks = getLocalStorageData("learning_tasks")
        let x = this.convertData({}, this.learning_tasks)
        console.log(x)
        this.data = null
        this.renderType = this.props.renderType;
        console.log(this.renderType)
        if (this.renderType === "overdue") {
            this.data = x.filter((element) => {
                return element.submission_status === "Overdue"
            })
        } else {
            this.data = x
        }
        this.learning_tasks_length = Object.keys(this.learning_tasks)
        this.subjects = []
        if (this.learning_tasks_length.length !== 0) {

            let info = this.getLearningTasksInfo(this.learning_tasks)
            this.subjects = info.subjects
            this.status_amounts = info.amounts
        }
        console.log(this.subjects)
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
                show: {
                    type: null,
                    value: null,
                }
            },
            status_amounts: {
                overdue: this.status_amounts.overdue,
                on_time: this.status_amounts.on_time,
                pending: this.status_amounts.pending,
                late: this.status_amounts.late,
            },
            subjects: this.subjects,
            offcanvas: {},
            sorted_data: this.data,
            new_data: {},
            old_data: {...this.learning_tasks}
        }
        this.ws = this.props.ws
    }
    getLearningTasksInfo = (data) => {
        let x = {
            amounts: {
                overdue: 0,
                on_time: 0,
                late: 0,
                pending: 0
            },
            subjects: [],
        }
        let length = Object.keys(data)
        for (let i = 0; i < length.length; i++) {
            if (x.subjects.includes(data[length[i]].subject_code) === false) {
                x.subjects.push(data[length[i]].subject_code)
            } 
            switch (data[length[i]].submission_status) {
                case "On time":
                    x.amounts.on_time++
                    break;
                case "Recieved late":
                    x.amounts.late++
                    break;
                case "Pending":
                    x.amounts.pending++
                    break;
                case "Overdue":
                    x.amounts.overdue++
                    break;
                default:
                    break;
            }
        }
        return x
    }
    handleDataPage = (value) => {
        this.setState({update_data_page: value})
    }
    handleLearningTasks = (value) => {
        let x = this.convertData({...value}, this.state.old_data)
        console.log(x)
        let info = this.getLearningTasksInfo(x)
        saveLocalStorageData({learning_tasks: {...value, ...this.state.old_data}})
        this.setState({new_data: {...value}, data: x, sorted_data: x, status_amounts: info.amounts, subjects: info.subjects})
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
    updateSort = (new_sort, type=false) => {
        let new_new_sort;
        let sort_x;
        if (type === false) {
            sort_x = this.state.sort[new_sort] === 0 ? 1 : this.state.sort[new_sort] === 1 ? 2 : 0;
            new_new_sort = {...this.state.sort, [new_sort]: sort_x}
        } else {
            sort_x = this.state.sort.show.type === type && this.state.sort.show.value === new_sort ? {type: null , value: null} : {type: type, value: new_sort}
            new_new_sort = {...this.state.sort, show: {type: sort_x.type, value: sort_x.value}}
        }
        this.sortData(new_new_sort, this.data)
    }
    sortData = (sort, dat) => {
        let data = new Array(...dat)
        let keys = Object.keys(sort)
        for (var i = 0; i < keys.length; i++) {
            switch (keys[i]) {
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
        if (sort.show.type !== null) {
            switch (sort.show.type) {
                case "subject":
                    data = showOnlySubject(data, sort.show.value)
                    break;
                case "status":
                    data = showOnlyStatus(data, sort.show.value)
                    break;
                case "year":
                    data = showOnlyYear(data, sort.show.value)
                    break;
                default:
                    break;
            }
        }
        this.setState({sorted_data: data, sort: sort,})
    }
    render() {
        return (
            <React.Fragment>
                {this.props.renderType !== "overdue"
                    ?   <React.Fragment>
                            <UpdateDataPage ws={this.ws} setDataPage={this.handleDataPage} setLearningTasks={this.handleLearningTasks} state={this.state.update_data_page} type="learning_tasks" />   
                            <Button type="button" onClick={() => this.setState({update_data_page: true})}>Update Data</Button>
                        </React.Fragment>
                    : null   
                }
                {this.state.sorted_data.length !== 0
                    ?   this.props.renderType !== "overdue"
                        ?   <React.Fragment>
                                <SortMenu updateSort={this.updateSort} subjects={this.subjects} statuses={this.statuses} />
                                <RenderLearningTasksAmount status_amounts={this.state.status_amounts} />
                            </React.Fragment>
                        :   null
                    : <h2>You have no learning tasks</h2>
                }
                <ListGroup variant="flush" className="scrollarea">
                    {this.state.sorted_data.map((task, index) => (
                        <ClompassLearningTask task={task} key={index} handleOffcanvas={this.handleOffcanvas} renderType={this.renderType}/>
                    ))}
                </ListGroup>
                {this.state.sorted_data.map((task, index) => (
                    <ClompassLearningTaskOffCanvas task={task} key={index} handleOffcanvas={this.handleOffcanvas} show={this.state.offcanvas[task.id]}/>
                ))}
            </React.Fragment>
        )
    }
}