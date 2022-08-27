import React from "react";
import {
    Container,
    Card
} from 'reactstrap';

import Dashheader from "components/Headers/Dashheader";

import jwt_decode from 'jwt-decode';
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import { connect } from 'react-redux';
import CSILogs from "components/CustomerSatisfaction/CSILogs";
import CustomerSatisfactionChart from "components/DashboardGraphs/CustomerSatisfactionChart";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
    };
};

class CSITab extends React.Component {
    constructor(props) {
        super(props);
        Mixpanel.track('Customer Emotions Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
        Mixpanel.time_event('Customer Emotions Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
    }
    componentWillUnmount() {
        Mixpanel.track('Customer Emotions Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
    }
    render() {
        return (
            <Card>
                <Dashheader title="Customer Emotions" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <Card>
                            <CustomerSatisfactionChart />
                        </Card>
                        <CSILogs />
                    </ErrorBoundary>
                </Container>
            </Card>
        );
    }
}

export default connect(
    mapStateToProps,
)(CSITab);