import React from "react";
import ReactDOM from 'react-dom';
import { io } from "socket.io-client"
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
} from "react-router-dom";
import { 
    Dashboard,
    PageNotFound, 
    ErrorPage, 
    Navbar, 
    LearningTasks, 
    Schedule, 
    Subject, 
    Subjects, 
    StudentInfo, 
    Settings,
} from "./components";
import { validateLocalStorageData } from "./functions"
import "./scss/app.scss"

export default class App extends React.Component {
    constructor(props) {
        super(props);
        validateLocalStorageData()
        this.ws = io("https://api.clompass.com/get", {transports: ["websocket"]})
        //this.ws = io("http://localhost:3001/get", {transports: ["websocket"]}) // connect to development server 
        
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
    }
    componentWillUnmount() {
        this.ws.disconnect();
    }
    render() {
        return (
            <Router>
                <Navbar />
                <Routes>
                        <Route path="/" element={<Dashboard ws={this.ws}/>} />
                        <Route path="/schedule" element={<Schedule ws={this.ws}/>} />
                        <Route path="/learning-tasks" element={<LearningTasks ws={this.ws} />} /> 
                    {/*
                        <Route path="/student" element={<StudentInfo ws={this.ws}/>} />
                        <Route path="/subjects" element={<Subjects ws={this.ws}/>}/>
                        <Route path="/subject/:subjectCode" element={<Subject ws={this.ws}/>} />
                        <Route path="/error" element={<ErrorPage />} />
                        <Route path="/settings" element={<Settings setState={this.handleSingleStateChange}/>} />
                        <Route path="*" element={<PageNotFound />} />
                    */}
                </Routes>
            </Router>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'));