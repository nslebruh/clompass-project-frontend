import React from 'react';
import {Offcanvas, Image, ListGroup, DropdownButton, Dropdown, Button, Stack, Container} from 'react-bootstrap';
import Parse from 'html-react-parser';

export default class LearningTasks extends React.Component {
    constructor(props) {
        super(props);
        this.offcanvasList = {};
        this.data = []
        this.keys = Object.keys(props.data)
        for (var l = 0; l < this.keys.length; l++) {
            this.data.push(props.data[this.keys[l]])
        }
        this.config = {
            statuses: ["Pending", "On time", "Recieved late", "Overdue"], 
            types: ["cat ", "pt", "hw", "sac"], 
            options: {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"},
            classes: [],
            renderType: props.renderType,
            status_amounts: {
                ontime: 0,
                overdue: 0,
                late: 0,
                pending: 0,
            }

        }
        for (var i = 0; i < props.data.length; i++) {
            this.offcanvasList[props.data[i].id] = false;
        }
        for (i = 0; i < this.keys.length; i++) {
            if (this.config.classes.includes(props.data[this.keys[i]].subject_code) === false) {
                this.config.classes.push(props.data[this.keys[i]].subject_code);
            }
        }
        for (i = 0; i < this.keys.length; i++) {
            if (props.data[this.keys[i]].submission_status === "Overdue") {
                this.config.status_amounts.overdue++
            } else if (props.data[this.keys[i]].submission_status === "Pending") {
                this.config.status_amounts.pending++
            } else if (props.data[this.keys[i]].submission_status === "On time") {
                this.config.status_amounts.ontime++
            } else if (props.data[this.keys[i]].submission_status === "Recieved late") {
                this.config.status_amounts.late++
            }
        }
        this.state = {
            data: this.data,
            offcanvasList: this.offcanvasList,
            sorts: {
                subject_sort: false,
                subject_sort_type: '',
                name_sort: false,
                name_sort_type: 0,
                date_sort: false,
                date_sort_type: 0,
                status_sort: false,
                status_sort_type: '',
                type_sort: false,
                type_sort_type: '',
            }
            
        }
    }
    
    resetSort = () => {
        this.setState({
            sorts: {
                subject_sort: false,
                subject_sort_type: '',
                name_sort: false,
                name_sort_type: 0,
                date_sort: false,
                date_sort_type: 0,
                status_sort: false,
                status_sort_type: '',
                type_sort: false,
                type_sort_type: '',
                
            }
        })
    }
    handleSortChange = (sort, sorts, sort_type = null) => {
        if (sort === "name") {
            if (sorts.name_sort === true) {
                sort_type = sorts.name_sort_type === 0 ? 1 : 0
                this.setState(prevState => ({
                    sorts: {
                        ...prevState.sorts,
                        name_sort_type: sort_type
                    }
                   
                })
                    )
            } else {
                this.setState(prevState => ({
                    sorts: {
                        ...prevState.sorts,
                        name_sort: true
                    }
                })
                )
            }
        }
        if (sort === "date") {
            if (sorts.date_sort === true) {
                sort_type = sorts.date_sort_type === 0 ? 1 : 0
                this.setState(prevState => ({
                    sorts: {
                        ...prevState.sorts,
                        date_sort_type: sort_type
                    }
                }))
                    
            } else {
                this.setState(prevState => ({
                    sorts: {
                        ...prevState.sorts,
                        date_sort: true
                    }
                }))
            }
        }
        if (sort === "status") {
            var status_sort = sorts.status_sort === true && sorts.status_sort_type === sort_type ? false : true
            sort_type = sorts.status_sort === true && sorts.status_sort_type === sort_type ? '' : sort_type
            this.setState(prevState => ({
                sorts: {
                    ...prevState.sorts,
                    status_sort: status_sort,
                    status_sort_type: sort_type
                }
            }))
        }
        if (sort === "subject") {
            var subject_sort = sorts.subject_sort === true && sorts.subject_sort_type === sort_type ? false : true 
            sort_type = sorts.subject_sort === true && sorts.subject_sort_type === sort_type ? '' : sort_type
            this.setState(prevState => ({
                sorts: {
                    ...prevState.sorts,
                    subject_sort: subject_sort,
                    subject_sort_type: sort_type
                }
            }))
        }
        if (sort === "type") {
            var type_sort = sorts.type_sort === true && sorts.type_sort_type === sort_type ? false : true
            sort_type = sorts.type_sort === true && sorts.type_sort_type === sort_type ? '' : sort_type
            this.setState(prevState => ({
                sorts: {
                    ...prevState.sorts,
                    type_sort: type_sort,
                    type_sort_type: sort_type
                }
            }))
        } 
    }

    handleOffcanvasChange = (id, change) => {
        this.setState({
            offcanvasList: {                      
                [id]: change
            }
        })      
            
    }
    renderTasks = () => {
        let tasks = this.sortTasks(this.state.sorts, this.state.data);
        return (
            <Container>
                {`You currently have ${this.config.status_amounts.overdue} overdue learning tasks`}
                <br/>
                {`You currently have ${this.config.status_amounts.late} late learning tasks`}
                <br/>
                {`You currently have ${this.config.status_amounts.pending} pending learning tasks`}
                <br/>
                {`You currently have ${this.config.status_amounts.ontime} on time learning tasks`}
                <br/>
                <Button type="button" onClick={() => this.handleSortChange("name", this.state.sorts)}>Sort by name</Button>
                <Button type="button" onClick={() => this.resetSort()}>Reset sort</Button>
                <Button type="button" onClick={() => this.handleSortChange("date", this.state.sorts)}>Sort by date</Button>
                <DropdownButton id="task-type-sort" title="Sort by task type">
                    {this.config.types.map((type, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange("type", this.state.sorts, type)} key={index}>
                            {type.toUpperCase()}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton id="class-sort" title="Sort by class">
                    {this.config.classes.map((class_code, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange("subject", this.state.sorts, class_code)} key={index}>
                            {class_code}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton id="status-sort" title="Sort by submission status">
                    {this.config.statuses.map((status, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange("status", this.state.sorts, status)} key={index}>
                            {status}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                {tasks.length <= 0 ? "No tasks" : 
                    
                        <ListGroup variant="flush" className="scrollarea">
                            {tasks.map((task, index) => (
                                <Stack gap={6}>
                                    <ListGroup.Item as="button" action onClick={() => this.handleOffcanvasChange(task.id, true)} key={index} id={task.id}>
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <strong className="mb-1">
                                                {task.name}
                                              </strong>
                                            <small>
                                                Due by {new Date(task.due_date).toLocaleDateString("en-US", this.config.options)}
                                              </small>
                                        </div>
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <div className="mb-1">
                                                {task.subject_name} - {task.subject_code}
                                            </div>
                                            <span>
                                                <small>
                                                    {"Submission Status: " + task.submission_status}
                                                </small>
                                                <Image src={task.submission_svg_link} alt={task.submission_status} width="25" height="25"/>
                                            </span>
                                        </div> 
                                    </ListGroup.Item>
                                </Stack>
                            ))}
                        </ListGroup>
                }
            </Container>
        )
    }
    renderOffcanvas = () => {
        let tasks = this.state.data;
        return (
            <>
                {tasks.map((task, index) => 
                    <Offcanvas show={this.state.offcanvasList[task.id]} onHide={() => this.handleOffcanvasChange(task.id, false)} key={index}>
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{task.name}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    Subject: {task.subject_name} - {task.subject_code}
                            <br/>
                            Submission status: {task.submission_status}
                            <br/>
                            Due date: {new Date(task.due_date).toLocaleDateString("en-US", this.config.options)}
                            <br/>
                            <br/>
                            {task.description !== null ? <>Description: {Parse(task.description)}<br/></> : <br/>}
                            Attachments: {task.attachments === null ? <>None<br/></> : task.attachments.map((attachment, index) => 
                                <div key={index}>
                                    <a href={attachment.link}>{attachment.name}</a>
                                    <br/>
                                </div>
                                )}
                            Submissions: {task.submissions === null ? "None" : task.submissions.map((submission, index) => (
                                <div key={index}>
                                    <a href={submission.link}>{submission.name}</a>
                                    <br/>
                                </div>
                            ))}
                    </Offcanvas.Body>
                </Offcanvas>
                )}
            </>
        )
    }
    sortTasks = (sorts, data) => {
        let tasks = new Array(...data);
        if (sorts.status_sort === true) {
            tasks = tasks.filter(i => {
                return i.submission_status === sorts.status_sort_type;
            })
        }
        if (sorts.subject_sort === true) {
            tasks = tasks.filter(i => {
                return i.subject_code === sorts.subject_sort_type;
            })
        }
        if (sorts.type_sort === true) {
            tasks = tasks.filter(i => {
                return (i.name.toLowerCase()).includes(sorts.type_sort_type);
            })
        }
        if (sorts.name_sort === true) {
            if (sorts.name_sort_type === 0) {
                tasks = tasks.sort((a,b) => {
                    return (a.name < b.name) - (a.name > b.name)
            }
                ) 
            } else {
                tasks = tasks.sort((a,b) => {
                    return (a.name > b.name) - (a.name < b.name)
                })  
            }       
        }
        if (sorts.date_sort === true) {
            if (sorts.date_sort_type === 0) {
                tasks = tasks.sort((a,b) => {
                    return (a.due_date < b.due_date) - (a.due_date > b._due_date)
                })
            } else {
                tasks = tasks.sort((a,b) => {
                    return (a.due_date > b.due_date) - (a.due_date < b.due_date)
                })
            }
        }
        if (!sorts.name_sort && !sorts.date_sort && !sorts.subject_sort && !sorts.status_sort && !sorts.type_sort) {
            tasks = this.state.data;
        }
        return tasks;
    }
    renderOverdueTasks = () => {
        let tasks = this.state.data.filter(i => {
            return i.submission_status === "Overdue" 
        })
        return (
            <>
                <ListGroup variant="flush" className="border-bottom scrollarea">
                    {tasks.map((task, index) =>
                        <ListGroup.Item as="button" action onClick={() => this.handleOffcanvasChange(task.id, true)} className="lh-tight" key={index}>
                                <div className="d-flex w-100 align-items-center justify-content-between">
                                    <strong className="mb-1">
                                        {task.name}
                                      </strong>
                                </div>
                                <div className="d-flex w-100 align-items-center justify-content-between text-center">
                                    <div className="mb-1">
                                        Due by {new Date(task.due_date).toLocaleDateString("en-us", this.config.options)}
                                    </div>
                                </div> 
                        </ListGroup.Item>
                                )}
                </ListGroup>
            </>
        )
    }
    renderOverdueOffcanvas = () => {
        let tasks = this.state.data.filter(i => {
            return i.submission_status === "Overdue"
        })
        return (
            <>
                {tasks.map((task, index) => 
                    <Offcanvas show={this.state.offcanvasList[task.id]} onHide={() => this.handleOffcanvasChange(task.id, false)} key={index}>
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{task.name}</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        Subject: {task.subject_name} - {task.subject_code}
                            <br/>
                            Submission status: {task.submission_status}
                            <br/>
                            Due date: {new Date(task.due_date).toLocaleDateString("en-US", this.config.options)}
                            <br/>
                            <br/>
                            Description: {task.description !== null ? <>{Parse(task.description)}<br/></> : <>No description <br/></>}
                            Attachments: {task.attachments === null || "None" ? <>None<br/></> : task.attachments.map((attachment, index) => 
                                <div key={index}>
                                    <a href={attachment.link}>{attachment.name}</a>
                                    <br/>
                                </div>
                                )}
                            Submissions: {task.submissions === null || "None" ? "None" : task.submissions.map((submission, index) => (
                                <div key={index}>
                                    <a href={submission.link}>{submission.name}</a>
                                    <br/>
                                </div>
                            ))}
                        </Offcanvas.Body>
                    </Offcanvas>
                )}
            </>
        ) 
    }
    render() {
        return (
            <>
                {this.config.renderType === "overdue" ? this.renderOverdueTasks() : this.renderTasks()}
                {this.config.renderType === "overdue" ? this.renderOverdueOffcanvas() : this.renderOffcanvas()}
            </>
        )
    }
}