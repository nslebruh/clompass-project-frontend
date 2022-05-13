import React from "react";
import { Link } from "react-router-dom";

export default class Subjects extends React.Component {
    constructor(props) {
        super(props)
        this.data = [];
        if (Object.keys(this.props.data).length !== 0) {
            for (let i in this.props.data) {
                let val = this.props.data[i]
                this.data.push(val)
            }
        } else {
            this.data = null
        }
    }
    render() {
        return (
            <>
            {this.data === null 
            ? <>No subject data</> 
            : this.data.map((subject, index) =>     
                <h1 key={index}>
                    <Link to={`/subject/${subject.school_id}`}>
                    {subject.name}
                    </Link>

                </h1>
            )}
            
            </>
        )
    }
}