import React from "react";
import {
  Container,
  Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import PPECheckLogs from 'components/PPECheck/PPECheckLogs'
import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"

import { connect } from 'react-redux';
import handleDateRange from 'utilFunctions/handleDateRange'
import PPECheckGraph from "components/DashboardGraphs/PPECheckGraph"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = state => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class PPECheckTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sopNumber: 1
    }
    this._ismounted = true;
    Mixpanel.track('PPECheck Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('PPECheck Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    this._ismounted = false;
    Mixpanel.track('PPECheck Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }

  render() {
    return (
      <>
        <Dashheader title="PPECheck" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <PPECheckGraph
                daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                outlet={this.props.outlet}
                time={this.props.time}
                startDate={""}
                endDate={""}
              />
            </Card>
            <PPECheckLogs outlet={this.state.outlet} time={this.state.time} />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
)(PPECheckTab);