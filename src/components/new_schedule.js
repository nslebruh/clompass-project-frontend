import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import "../scss/new_schedule.scss";
const colours = [
    {
        id: 0,
        color: "#1ca8dd"
    },
    {
        id: 1,
        color: "#d9534f"
    }
];
const RenderAppointment = (model) => {
    return (
        <>
            <div className="dx-scheduler-appointment-title">
                {model.appointmentData.subject}
            </div>
            <div className="dx-scheduler-appointment-content-details">
                {model.appointmentData.room ? model.appointmentData.room : "No room"} - {model.appointmentData.teacher ? model.appointmentData.teacher : "No teacher given"}
                
            </div>
            <div className='dx-scheduler-appointment-content-date'>
                {model.appointmentData.formattedStart} - {model.appointmentData.formattedEnd}
            </div>
            
        </>
    )
}


export default class Schedule extends React.Component {
    constructor(props) {
        super(props);
        try {
            let data = localStorage.getItem("clompass-data")
            console.log(data)
            data = JSON.parse(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
        this.data = []
        this.keys = Object.keys(props.data)
        if (props.data !== null && props.data !== undefined) {
            for (var i = 0; i < this.keys.length; i++) {
                this.data.push(props.data[this.keys[i]])
            }
        }
        this.state = {}
        this.views = this.props.onlyDayView === "true" ? ["day"] : ["day", "week", "month"] 

    }
    render() {
        return (
            <Scheduler 
                dataSource={this.data}
                appointmentRender={RenderAppointment}
                timeZone={"Australia/Melbourne"}
                views={this.views}
                showAllDayPanel={false}
                height={this.props.onlyDayView !== "true" ? 635 : 579}
                cellDuration={45}
                startDayHour={8}
                endDayHour={15.5}
                showCurrentTimeIndicator={true}

                defaultCurrentView={this.props.onlyDayView === "true" ? "day" : "week"}
                defaultCurrentDate={new Date()}
            >
                <Resource
                    dataSource={colours}
                    fieldExpr={"classChanged"}
                    label={'Class'}
                    useColorAsDefault={true}
                />
            </Scheduler>
        )
    }
}