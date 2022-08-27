import React, { Component } from 'react'

import {
    ButtonGroup,
    Button,
} from 'reactstrap'
import AddEmployee from './AddEmployee'
import ViewAttendance from "./ViewAttendance"
class EmpAttendance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attendanceComponent: 1
        };
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div align="center">
                <ButtonGroup>
                    <Button color="secondary" onClick={() => this._ismounted && this.setState({ attendanceComponent: 1, feedURL: "std-sop-1" })} active={this.state.attendanceComponent === 1}>View Attendance</Button>
                    <Button color="secondary" onClick={() => this._ismounted && this.setState({ attendanceComponent: 2, feedURL: "std-sop-2" })} active={this.state.attendanceComponent === 2}>Add Employee</Button>
                </ButtonGroup>
                <br /><br />
                <br />
                {this.state.attendanceComponent === 1 ?
                    <ViewAttendance />
                    :
                    <AddEmployee />
                }
            </div >
        )
    }
}

export default EmpAttendance