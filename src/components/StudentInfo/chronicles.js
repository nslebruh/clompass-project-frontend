import React from "react";
import { ListGroup, Offcanvas } from "react-bootstrap";

export default class Chronicles extends React.Component {
    constructor(props) {
        super(props);
        this.data = []
        this.keys = Object.keys(props.data)
        this.ids = {}
        for (var i = 0; i < this.keys.length; i++) {
            this.ids[props.data[i].id] = false
        }

        for (i = 0; i < this.keys.length; i++) {
            this.data.push(props.data[i])
        }
        this.state = {
            ids: this.ids
        }
    }
    handleOffcanvasChange = (id, state) => {
        this.setState({ids: {
            ...this.state.ids,
            [id] : state
        }})

    }
    render() {
        return  (
            <>
            <h1>Chronicles</h1>
            <ListGroup variant="flush" className="scrollarea">
            {this.data.map((data, index) => (
                <ListGroup.Item as="button" key={index} action onClick={() => this.handleOffcanvasChange(data.id, true)} >
                    <div className="d-flex w-100 align-items-center justify-content-between">
                                            <strong className="mb-1">
                                                {data.name}
                                              </strong>
                    </div>
                    Occured on {new Date(data.occurredTimestamp).toLocaleTimeString("au-en", {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"})} <br/>
                </ListGroup.Item>
            ))}
            </ListGroup>
            {this.data.map((data, index) => 
                    <Offcanvas show={this.state.ids[data.id]} onHide={() => this.handleOffcanvasChange(data.id, false)} key={index}>
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{data.name}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    Occured on {new Date(data.occurredTimestamp).toLocaleTimeString("au-en", {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"})} <br/>
                    Created on {new Date(data.createdTimestamp).toLocaleTimeString("au-en", {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"})} <br/>
                    <br/>
                    {data.data.map((variable, index) => (
                        <div key={index}>
                        {variable.name} <br/>
                        {variable.description} <br/>
                        {variable.values.map((val, index) => (
                            <div key={index}>
                            {val.type === "text" ? val.text : `${val.name}: ${val.checked === true ? "Yes" : "No"}`} <br/>
                            </div>
                        ))}
                        <br/>
                        </div>

                    ))}
                    </Offcanvas.Body>
                </Offcanvas>
                )}
            </>
        )
    }
}