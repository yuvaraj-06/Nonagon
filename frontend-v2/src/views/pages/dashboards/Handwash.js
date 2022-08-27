import React from "react";
import {
    Container,
    Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"

import HandwashLogs from 'components/Handwash/HandwashLogs'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import { connect } from 'react-redux';
import handleDateRange from 'utilFunctions/handleDateRange'
import HandwashGraph from "components/DashboardGraphs/HandwashGraph";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
};

class Handwash extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Handwash Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Handwash Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Handwash Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <Dashheader title="Handwash" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <Card>
                            <HandwashGraph
                                daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                                outlet={this.props.outlet}
                                time={this.props.time}
                                startDate={""}
                                endDate={""}
                            />
                        </Card>
                        <HandwashLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(Handwash);