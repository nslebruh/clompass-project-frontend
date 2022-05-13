import React from "react";
import { Form, Button, ButtonGroup, } from "react-bootstrap";

export default class MyTasks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            new_task_message: "",
            tasks_to_delete: [],
            tasks: []
        }
    }
    render() {
        return (
            <>
            <h1>
                My Tasks
            </h1>
            </>
        )
    }
}