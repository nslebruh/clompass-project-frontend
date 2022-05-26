import React from 'react';
import { 
    validateLocalStorageData, 
    getLocalStorageData,
    saveLocalStorageData,
    fetchSchedule,
    appendData,
} from "../../functions"
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { Button } from 'react-bootstrap';
import { UpdateDataPage } from '../updateData';
import "./schedule.scss"
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
        <div>
            <div className="dx-scheduler-appointment-title">
                {model.appointmentData.subject}
            </div>
            <div className="dx-scheduler-appointment-content-details">
                {model.appointmentData.room ? model.appointmentData.room : "No room"} - {model.appointmentData.teacher ? model.appointmentData.teacher : "No teacher given"}
                
            </div>
            <div className='dx-scheduler-appointment-content-date'>
                {model.appointmentData.formattedStart} - {model.appointmentData.formattedEnd}
            </div>
            
        </div>
    )
}

export default class Schedule extends React.Component {
    constructor(props) {
        super(props);
        validateLocalStorageData()
        this.schedule_data = getLocalStorageData("schedule_data")
        console.log(this.schedule_data)
        this.schedule_url = getLocalStorageData("schedule_url")
        console.log(this.schedule_url)
        this.ws = props.ws
        this.state = {
            data: [],
            data_store: {
                new: {},
                saved: this.schedule_data,
            },
            update_data_page: false,
            schedule_url: this.schedule_url,
        }
        this.views = this.props.onlyDayView === "true" ? ["day"] : ["day", "week", "month"] 

    }
    handleDataPage = (value) => {
        this.setState({update_data_page: value})
    }
    handleOldData = (value) => {
        this.setState({data_store: {
            saved: {...this.state.data_store.saved, ...value}
        }})
    }
    handleUrl = (value) => {
        this.setState({schedule_url: value})
    }
    async componentDidMount () {
        let new_data;
        console.log("schedule component mounted")
        if (this.state.schedule_url !== "") {
            new_data = await fetchSchedule(this.state.schedule_url)
        }
        let x = appendData(new_data, this.state.data_store.saved)
        this.setState({
            data: x,
            data_store: {
                new: {...new_data},
                saved: this.state.data_store.saved
            }
        })

    }
    componentWillUnmount () {
        console.log("schedule component unmounting")
        console.log(this.state.schedule_url)
        saveLocalStorageData({schedule_url: this.state.schedule_url, schedule_data: this.state.data_store.saved}) 
    }
    render() {
        return (
            <React.Fragment>  
                {this.props.onlyDayView !== "true" 
                    ?   <React.Fragment>
                            <UpdateDataPage state={this.state.update_data_page} setOldData={this.handleOldData} setUrl={this.handleUrl} setDataPage={this.handleDataPage} ws={this.ws} type="schedule" />
                            <Button type="button" onClick={() => this.setState({update_data_page: true})}>Update Data</Button>
                            {this.state.schedule_url.length !== 0 ?<span>Add this calender to your own calender: <a href={this.state.schedule_url.replace("https://", "webcal://")} target="_blank" rel="noreferrer">Here</a></span> : null}
                        </React.Fragment>
                    : null
                }
                
                <Scheduler 
                    dataSource={this.state.data}
                    appointmentRender={RenderAppointment}
                    timeZone={"Australia/Melbourne"}
                    views={this.views}
                    showAllDayPanel={false}
                    height={this.props.onlyDayView !== "true" ? 635 : 579}
                    cellDuration={45}
                    startDayHour={8}
                    endDayHour={15.5}
                    showCurrentTimeIndicator={true}
                    //adaptivityEnabled={true}
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
            </React.Fragment>
        )
    }
}