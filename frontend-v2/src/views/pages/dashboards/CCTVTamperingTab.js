import React from "react";
import {
    Container,
    // Row, Col, Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import CCTVTamperingLogs from 'components/CCTVTampering/CCTVTamperingLogs'

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

class CCTVTamperingTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('CCTV Tampering Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('CCTV Tampering Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('CCTV Tampering Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    render() {
        return (
            <>
                <Dashheader title="CCTV Tampering" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <CCTVTamperingLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(CCTVTamperingTab);