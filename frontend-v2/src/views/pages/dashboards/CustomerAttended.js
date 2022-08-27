import React from "react";
import {
    Container,
    Card,
} from 'reactstrap';

import Dashheader from "components/Headers/Dashheader";

import jwt_decode from 'jwt-decode';
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import { connect } from 'react-redux';
import CALogs from "components/CustomerAttended/CALogs";
import CustomerAttendedGraph from "components/DashboardGraphs/CustomerAttendedGraph";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
    };
};

class CustomerAttendedTab extends React.Component {
    constructor(props) {
        super(props);
        Mixpanel.track('Customers Unattended Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
        Mixpanel.time_event('Customers Unattended Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
    }
    componentWillUnmount() {
        Mixpanel.track('Customers Unattended Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
    }
    render() {
        return (
            <>
                <Dashheader title="Customers Unattended" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <Card>
                            <CustomerAttendedGraph />
                        </Card>
                        <CALogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(CustomerAttendedTab);