import React from 'react';
import { 
    validateLocalStorageData, 
    getLocalStorageData,
    saveLocalStorageData,
    fetchSchedule,
} from "../../functions"
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { Button } from 'react-bootstrap';
import { UpdateDataPage } from '../updateData';
import "./new_schedule.scss"
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
                saved: {},
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
        let data = {}
        let keys1 = {}
        let keys2 =  {}
        let d;
        let y;
        let x = []
        console.log("schedule component mounted")
        if (this.schedule_url !== "") {
            d = await fetchSchedule(this.schedule_url)
            if (d.length !== 0) {
                keys1 = Object.keys(d)
                keys1.forEach(element => {
                    data[element] = d[element]
                });
            }
        }
        if (this.schedule_data.length !== 0) {
            keys2 = Object.keys(this.schedule_data)
            keys2.forEach(element => {
                data[element] = this.schedule_data[element]
            })
        }
        y = Object.keys(data)
        y.forEach(element => {
            x.push(data[element])
        })
        this.setState({
            data: x,
            data_store: {
                new: {...d},
                saved: {...this.schedule_data}
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