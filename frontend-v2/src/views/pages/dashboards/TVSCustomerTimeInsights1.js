import React from "react";
import { Container, Card } from "reactstrap";

import Dashheader from "components/Headers/Dashheader";

import jwt_decode from "jwt-decode";
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import { connect } from "react-redux";
import TVSCustomerTimeInsightGraph1 from "components/DashboardGraphs/TVSCustomerTimeInsightGraph1";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
import TVSCTILogs1 from "../../../components/TVSBK1/CTILogs";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
  };
};

class TVSCustomerTimeInsightsTab1 extends React.Component {
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
        <Dashheader title="Motorcycle Regions - Customers Time Insights" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <TVSCustomerTimeInsightGraph1 />
            </Card>
            <TVSCTILogs1 />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(TVSCustomerTimeInsightsTab1);
