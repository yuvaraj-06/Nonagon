import React from "react";
import {
    Container,
    // Row, Col, Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import EntranceMannedLogs from 'components/EntranceManned/EntranceMannedLogs'

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

class EntranceMannedTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Security Presence Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Security Presence Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Security Presence Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    render() {
        return (
            <>
                <Dashheader title="Security Presence" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <EntranceMannedLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(EntranceMannedTab);