import React from "react";
import {
    Container, Card,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import HygieneIndexGraph from "components/DashboardGraphs/HygieneIndexGraph";

import { connect } from 'react-redux';
import handleDateRange from 'utilFunctions/handleDateRange'
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
};


class EntryExit extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Hygiene Index Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Hygiene Index Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    componentWillUnmount() {
        Mixpanel.track('Hygiene Index Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    render() {
        return (
            <>
                <Dashheader title="Hygiene Index" />

                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <Card>
                            <HygieneIndexGraph
                                daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                                outlet={this.props.outlet}
                                time={this.props.time}
                                startDate={""}
                                endDate={""}
                            />
                        </Card>
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(EntryExit);
