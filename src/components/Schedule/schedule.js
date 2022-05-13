import React from "react";
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, WeekView, Toolbar, DateNavigator, Appointments, TodayButton, DayView, MonthView, ViewSwitcher, } from '@devexpress/dx-react-scheduler-material-ui';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.data = []
        this.keys = Object.keys(props.data)
        if (props.data !== null && props.data !== undefined) {
            for (var i = 0; i < this.keys.length; i++) {
                this.data.push(props.data[this.keys[i]])
            }
        }
        console.log(this.data)
        this.state = {
            mounted: false,
            data: this.data,
            onlyDayView: this.props.onlyDayView,
            current_date: new Date(),
        };
    }
    componentDidMount() {
        this.setState({mounted: true});
    }
    render() {
        return (
            <Paper>
                <Scheduler data={this.data} height={this.state.onlyDayView !== "true" ?  "auto" : "640"}>
                    <ViewState defaultCurrentDate={this.state.current_date}/>
                    {this.state.onlyDayView !== "true" ? <WeekView startDayHour={8} endDayHour={16}/> : null}
                    <DayView startDayHour={8} endDayHour={16}/>
                    {this.state.onlyDayView !== "true" ? <MonthView startDayHour={8} endDayHour={16}/> : null}
                    
                    <Toolbar />
                    <DateNavigator />
                    {this.state.onlyDayView !== "true" ? <TodayButton /> : null}
                    {this.state.onlyDayView !== "true" ? <ViewSwitcher /> : null}
                    <Appointments />
                </Scheduler>
            </Paper>
        )
    }
}