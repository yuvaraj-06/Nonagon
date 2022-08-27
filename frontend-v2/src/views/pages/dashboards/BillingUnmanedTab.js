import React from "react";
import {
    Container,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import BillingUnmannedLogs from 'components/BillingUnmanned/BillingUnmannedLogs'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

class BillingUnmanned extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Billing Unmanned Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Billing Unmanned Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    componentWillUnmount() {
        Mixpanel.track('Billing Unmanned Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <Dashheader title="Billing Unmanned" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <BillingUnmannedLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default BillingUnmanned;
