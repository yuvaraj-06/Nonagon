import React from "react";
import {
  Container,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import FindKOT from 'components/KOT/FindKOT'
import KOTLogs from 'components/KOT/KOTLogs'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
class KOTTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: jwt_decode(localStorage.getItem('act')).name,
      outlet: jwt_decode(localStorage.getItem('act')).outlet,
      theme: this.props.theme,
      time: 'day',
      buttonNo: 1
    }
    this._ismounted = true;
    Mixpanel.track('KOT Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('KOT Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    this._ismounted = false;
    Mixpanel.track('KOT Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }

  render() {
    return (
      <>
        <Dashheader title="Kitchen Order Ticket" />
        <Container className="mt--6">
          <ErrorBoundary>
            <FindKOT outlet={this.state.outlet} />
            <KOTLogs />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default KOTTab;
