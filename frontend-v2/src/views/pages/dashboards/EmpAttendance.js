import React from "react";
import {
    Container
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import EmployeeAttendace from 'components/EmpAttendance/EmpAttendance'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

class EmpAttendance extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.name,
            outlet: jwt_decode(localStorage.getItem('act')).outlet,
            theme: this.props.theme,
            time: "day"
        }
        Mixpanel.track('Employee Attendance Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Employee Attendance Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Employee Attendance Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <Dashheader title="Employee Attendance" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <EmployeeAttendace />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default EmpAttendance;