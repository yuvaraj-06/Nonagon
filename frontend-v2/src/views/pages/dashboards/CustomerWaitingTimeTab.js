import React from "react";
import { Container, Card } from "reactstrap";

import Dashheader from "components/Headers/Dashheader";

import jwt_decode from "jwt-decode";
import { Mixpanel } from "../../../Mixpanel/mixpanel";

import ComparisonGraph from "components/HourWiseComparison/ComparisonGraph";

import { connect } from "react-redux";
import CustomerConversionForm from "components/CustomerConversion/CCForm";
import CustomerConversionLog from "components/CustomerConversion/CCLogs";
import CustomerConversionGraph from "components/DashboardGraphs/CustomerConversionGraph";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
  };
};

class CustomerWaitingTimeTab extends React.Component {
  constructor(props) {
    super(props);
    Mixpanel.track("Customers Attended Tab", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
    Mixpanel.time_event("Customers Attended Tab Time", {
      distinct_id: jwt_decode(localStorage.getItem("act")).email,
      email: jwt_decode(localStorage.getItem("act")).email,
    });
  }
  componentWillUnmount() {
    Mixpanel.track("Customers Attended Tab Time", {
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
            <CustomerConversionForm />
            <Card>
              <CustomerConversionGraph />
            </Card>
            <CustomerConversionLog />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps)(CustomerWaitingTimeTab);
