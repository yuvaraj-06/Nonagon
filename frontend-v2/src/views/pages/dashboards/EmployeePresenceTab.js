import React from "react";
import {
    Container,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import EmployeePresenceLogs from 'components/EmployeePresence/EmployeePresenceLogs.js'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

class EmployeePresence extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Employee Presence Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Employee Presence Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    componentWillUnmount() {
        Mixpanel.track('Employee Presence Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <Dashheader title="Employee Presence" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <EmployeePresenceLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default EmployeePresence;
