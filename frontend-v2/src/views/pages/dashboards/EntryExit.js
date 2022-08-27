import React from "react";
import {
  Container, Card,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import EntryExitLogs from 'components/EntryExit/EntryExitLogs'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import EntryExitGraph from "components/DashboardGraphs/EntryExitGraph";

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
    Mixpanel.track('EntryExit Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('EntryExit Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }

  componentWillUnmount() {
    Mixpanel.track('EntryExit Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }

  render() {
    return (
      <>
        <Dashheader title="Entry and Exit" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <EntryExitGraph
                daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                outlet={this.props.outlet}
                time={this.props.time}
                startDate={""}
                endDate={""}
              />
            </Card>
            <EntryExitLogs />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
)(EntryExit);
