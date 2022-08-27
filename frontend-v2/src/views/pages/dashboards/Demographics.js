import React from "react";
import {
  Container,
  Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import DemographicLogs from 'components/Demographics/DemographicLogs'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"

import { connect } from 'react-redux';
import handleDateRange from 'utilFunctions/handleDateRange'
import DemographicsGraph from "components/DashboardGraphs/DemographicsGraph";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
const mapStateToProps = state => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class Demographics extends React.Component {
  constructor(props) {
    super(props)
    Mixpanel.track('Demographics Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('Demographics Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    Mixpanel.track('Demographics Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  render() {
    return (
      <>
        <Dashheader title="Demographics" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <DemographicsGraph
                daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                outlet={this.props.outlet}
                time={this.props.time}
                startDate={""}
                endDate={""}
              />
            </Card>
            <DemographicLogs />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
)(Demographics);