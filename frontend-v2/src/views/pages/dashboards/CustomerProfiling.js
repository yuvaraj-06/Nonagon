import React from "react";
import {
    Container,
    Row,
    Col,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

class CustomerProfiling extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.name,
            outlet: jwt_decode(localStorage.getItem('act')).outlet,
            theme: this.props.theme,
            time: "day"
        }
        Mixpanel.track('Customer Profiling Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Customer Profiling Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
    }
    componentWillUnmount() {
        Mixpanel.track('Customer Profiling Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <Dashheader title="Customer Profiling" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <Row>
                            <Col xs="6">
                            </Col>
                            <Col xs="6">
                                <center><span className="h3">Previous purchase records will be shown here.</span></center>
                            </Col>
                        </Row>
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default CustomerProfiling;