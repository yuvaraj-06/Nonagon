import React from "react";
import {
    Container,
    // Row, Col, Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import SDLogs from 'components/SocialDistancing/SDLogs'

import { Mixpanel } from "../../../Mixpanel/mixpanel"
import jwt_decode from "jwt-decode";

import { connect } from 'react-redux';
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
// import handleDateRange from 'utilFunctions/handleDateRange'
// import SocialDistancingGraph from "components/DashboardGraphs/SocialDistancingGraph";

const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
};

class SocialDistancing extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Social Distancing Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Social Distancing Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Social Distancing Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    render() {
        return (
            <>
                <Dashheader title="Social Distancing" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        {/*
                    <Card>
                        <SocialDistancingGraph
                            daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                            outlet={this.props.outlet}
                            time={this.props.time}
                            startDate={""}
                            endDate={""}
                        />
                    </Card> */}
                        <SDLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(SocialDistancing);