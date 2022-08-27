import React from "react";
import {
  Container,
  // Row, Col, Card
} from "reactstrap";

import Dashheader from "components/Headers/Dashheader";
import ANPRCountLogs from "components/ANPR/ANPRCountLogs";

import { Mixpanel } from "../../../Mixpanel/mixpanel";
import jwt_decode from "jwt-decode";

import { connect } from "react-redux";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
// import handleDateRange from 'utilFunctions/handleDateRange'

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    outletTimezone: state.outletCode.outletTimezone,
  };
};

class ANPRTab extends React.Component {
  constructor(props) {
    super(props);
    // Mixpanel.track("Social Distancing Tab", {
    //   distinct_id: jwt_decode(localStorage.getItem("act")).email,
    //   email: jwt_decode(localStorage.getItem("act")).email,
    // });
    // Mixpanel.time_event("Social Distancing Tab Time", {
    //   distinct_id: jwt_decode(localStorage.getItem("act")).email,
    //   email: jwt_decode(localStorage.getItem("act")).email,
    // });
  }
  componentWillUnmount() {
    // Mixpanel.track("Social Distancing Tab Time", {
    //   distinct_id: jwt_decode(localStorage.getItem("act")).email,
    //   email: jwt_decode(localStorage.getItem("act")).email,
    // });
  }

  render() {
    return (
      <>
        <Dashheader title="Number Plates Detected" />
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
            <ANPRCountLogs />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(ANPRTab);
