import React from "react";
import { Container, Card } from "reactstrap";

import Dashheader from "components/Headers/Dashheader";

import jwt_decode from "jwt-decode";
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import { connect } from "react-redux";
import TVSCustomerTimeInsightGraph2 from "components/DashboardGraphs/TVSCustomerTimeInsightGraph2";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
import TVSCTILogs2 from "../../../components/TVSBK2/CTILogs";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
  };
};

class TVSCustomerTimeInsightsTab2 extends React.Component {
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
        <Dashheader title="Customers Time Insights" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Card>
              <TVSCustomerTimeInsightGraph2 />
            </Card>
            <TVSCTILogs2 />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(TVSCustomerTimeInsightsTab2);
