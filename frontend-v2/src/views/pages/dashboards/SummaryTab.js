import React from "react";
import {
  Container,
} from 'reactstrap'

import DashheaderNTS from "components/Headers/DashheaderNTS"

import SummaryTabCard from 'components/Summary/SummaryTabCard'
import 'components/Summary/SummaryCard.scss'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
  };
};

class SummaryTab extends React.Component {
  constructor(props) {
    super(props)
    Mixpanel.track('Highlights Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('Highlights Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    Mixpanel.track('Highlights Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  render() {
    return (
      <>
        <DashheaderNTS title="Summary" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <SummaryTabCard />
          </ErrorBoundary>
        </Container>

      </>
    );
  }
}

export default connect(
  mapStateToProps,
)(SummaryTab);