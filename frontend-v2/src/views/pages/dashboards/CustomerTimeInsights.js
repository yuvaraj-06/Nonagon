import React from "react";
import { Container, Card } from "reactstrap";

import Dashheader from "components/Headers/Dashheader";

import jwt_decode from "jwt-decode";
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import { connect } from "react-redux";
import CustomerTimeInsightGraph from "components/DashboardGraphs/CustomerTimeInsightGraph";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
import CTILogs from "../../../components/CustomerTimeInsights/CTILogs";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
  };
};

class CustomerTimeInsightsTab extends React.Component {
  constructor(props) {
    super(props);
    Mixpanel.track("Customer Time Insights Tab", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
    Mixpanel.time_event("Customer Time Insights Tab Time", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
  }
  componentWillUnmount() {
    Mixpanel.track("Customer Time Insights Tab Time", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
  }
  render() {
    return (
      <>
        <Dashheader title="Customers Conversion" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <CustomerTimeInsightGraph />
            </Card>
            <CTILogs />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(CustomerTimeInsightsTab);
