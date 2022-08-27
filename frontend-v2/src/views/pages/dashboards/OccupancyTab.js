import React from "react";
import {
    Container,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import OccupancyLogs from 'components/Dashboard/Occupancy/OccupancyLogs'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
class OccupancyTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Occupancy Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Occupancy Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Occupancy Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <Dashheader title="Room Occupancy" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <OccupancyLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default OccupancyTab;