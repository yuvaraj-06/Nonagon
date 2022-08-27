import React from "react";
import { Container, Card } from "reactstrap";

import Dashheader from "components/Headers/Dashheader";

import PCLogs from "components/PeopleCount/PCLogs";
import PeopleCountGraph from "components/DashboardGraphs/PeopleCountGraph";

import jwt_decode from "jwt-decode";
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import { connect } from "react-redux";
import handleDateRange from "utilFunctions/handleDateRange";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class PeopleCount extends React.Component {
  constructor(props) {
    super(props);
    Mixpanel.track("People Count Tab", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
    Mixpanel.time_event("People Count Tab Time", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
  }
  componentWillUnmount() {
    Mixpanel.track("People Count Tab Time", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
  }
  render() {
    return (
      <>
        <Dashheader title="People Count" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <PeopleCountGraph
                daterange={handleDateRange(this.props.time, this.props.outletTimezone)}
                outlet={this.props.outlet}
                time={this.props.time}
                startDate={""}
                endDate={""}
              />
            </Card>
            <PCLogs />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(PeopleCount);
