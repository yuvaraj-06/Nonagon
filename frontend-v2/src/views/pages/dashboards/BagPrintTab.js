import React from "react";
import {
    Container,
    Card
} from 'reactstrap';

import Dashheader from "components/Headers/Dashheader";

import jwt_decode from 'jwt-decode';
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import { connect } from 'react-redux';
import handleDateRange from 'utilFunctions/handleDateRange';
import BagPrintLogs from "components/BagPrint/BagPrintLogs";
import BagPrintGraph from "components/DashboardGraphs/BagPrintGraph";
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
        super(props);
        Mixpanel.track('Packaging Print Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
        Mixpanel.time_event('Packaging Print Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
    }
    componentWillUnmount() {
        Mixpanel.track('Packaging Print Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email });
    }
    render() {
        return (
            <>
                <Dashheader title="Packaging Print" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <Card>
                            {/* <Graph /> */}
                            <BagPrintGraph
                                daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                                outlet={this.props.outlet}
                                time={this.props.time}
                                startDate={""}
                                endDate={""}
                            />
                        </Card>
                        <BagPrintLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(Handwash);