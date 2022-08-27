import React from "react";
import {
  Container,
  Card
} from "reactstrap";

import Dashheader from "components/Headers/Dashheader";
import DRLogs from "components/DeliveryRate/DRLogs";

import { Mixpanel } from "../../../Mixpanel/mixpanel";
import jwt_decode from "jwt-decode";

import { connect } from "react-redux";
import DeliveryRateGraph from "components/DashboardGraphs/DeliveryRateGraph";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
  };
};

class DeliveryRateTab extends React.Component {
  constructor(props) {
    super(props);
    Mixpanel.track("Delivery Rate Tab", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
    Mixpanel.time_event("Delivery Rate Tab Time", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
  }
  componentWillUnmount() {
    Mixpanel.track("Delivery Rate Tab Time", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
  }

  render() {
    return (
      <>
        <Dashheader title="Delivery Rate" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <DeliveryRateGraph />
            </Card>
            <DRLogs />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(DeliveryRateTab);
