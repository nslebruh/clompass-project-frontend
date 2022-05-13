import React from 'react';
import {
    Offcanvas,
    Button,
    Form,
    Spinner,
} from "react-bootstrap"
import { saveLocalStorageData } from '../../functions';

export class UpdateDataPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            messages: [],
            error: null,
            username: '',
            password: '',
            year: 2022,
            month: 1,
            get_type: this.props.type,
        }
        this.type = this.props.type
        this.ws = this.props.ws
        this.setOldData = this.props.setOldData || null
        this.setUrl = this.props.setUrl || null
        this.setDataPage = this.props.setDataPage || null
        this.setLearningTasks = this.props.setLearningTasks || null
        this.years = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]
    }
    async componentDidMount() {
        this.ws.on("data", (status_code, timestamp, message, response_type, data) => {
            console.log(status_code, timestamp, message, response_type)
            console.log(data)
            if (response_type === "schedule_data") {
                this.setOldData(data)
            } else if (response_type === "schedule_url") {
                this.setUrl(data)
                saveLocalStorageData({schedule_url: data})
            } else if (response_type === "learning_tasks") {
                this.setLearningTasks(data)
            }
            this.setState({fetching: false,  messages: [{status_code: status_code, timestamp: timestamp, message: message}]})
        })
        this.ws.on("message", (status_code, timestamp, message) => {
            console.log(status_code, timestamp, message)
            this.setState({messages: [...this.state.messages, {status_code: status_code, timestamp: timestamp, message: message}]})
        })
        this.ws.on("error", (status_code, timestamp, message, error) => {
            console.log(status_code, timestamp, message, error)
            this.setState({error: error, fetching: false})
        })
    }
    sendEmit = (type, username, password, year, month) => {
        this.setState({fetching: true, messages: [], error: null})
        this.ws.emit(type, username, password, year, month)
    }
    render() {
        return (
            <div>
                <Offcanvas show={this.props.state} onHide={() => this.setDataPage(false)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Update Data</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Button type="button" onClick={() => saveLocalStorageData()}>
                            Reset local storage
                        </Button>
                        <Form>
                            <Form.Label>Input Username</Form.Label>
                            <Form.Control type="text" placeholder="username" name="username" id="username" onChange={(event) => this.setState({[event.target.name]: event.target.value})} />
                            <br/>
                            <Form.Label>Input Password</Form.Label>
                            <Form.Control type="password" placeholder="password" name="password" id="password" onChange={(event) => this.setState({[event.target.name]: event.target.value})} />
                            {this.type !== "schedule" 
                                ?   null 
                                :   (   
                                        <React.Fragment>
                                            <Button type="button" onClick={() => this.setState({get_type: "schedule"})}>
                                                Schedule {this.state.get_type === "schedule" ? "tick" : null}
                                            </Button>
                                            <Button type="button" onClick={() => this.setState({get_type: "getcalender"})}>
                                                Getcalender {this.state.get_type === "getcalender" ? "tick" : null}
                                            </Button>
                                        </React.Fragment>
                                    )
                            }
                            {this.type !== "learningtasks" 
                                ?   null
                                :   (
                                        <React.Fragment>
                                            {this.years.map((year, index) => (
                                                <Button key={index} type="button" onClick={() => this.setState({year: year})}>
                                                    {year} {this.state.year === year ? "tick" : null}
                                                </Button>
                                            ))}
                                            <br/>
                                        </React.Fragment>
                                        
                                    )
                            }
                            <br/>
                            {this.state.fetching ? <Button disabled><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button> : <Button type="button" onClick={() => this.sendEmit(this.state.get_type, this.state.username, this.state.password, this.state.year, this.state.month)}>Get data</Button>}
                        </Form>
                        {this.state.messages.map((message, index) => (
                            <p key={index}>
                                {message.timestamp}: {message.status_code} - {message.message}
                            </p>
                        ))}
                        {this.state.error ? <h1>Error: {this.state.error}</h1> : null}
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        )
    }
}