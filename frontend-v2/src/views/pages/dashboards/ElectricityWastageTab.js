import React from "react";
import {
    Container,
    // Row, Col, Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import EWLogs from "components/ElectricityWastage/EWLogs";

import { Mixpanel } from "../../../Mixpanel/mixpanel"
import jwt_decode from "jwt-decode";

import { connect } from 'react-redux';
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
    };
};

class ElectricityWastageTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Electricity Wastage Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Electricity Wastage Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Electricity Wastage Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    render() {
        return (
            <>
                <Dashheader title="Electricity Wastage" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <EWLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(ElectricityWastageTab);