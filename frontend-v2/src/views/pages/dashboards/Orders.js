import React from "react";
import {
  Container
} from 'reactstrap'

import Dashheader from 'components/Headers/Dashheader'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
class Orders extends React.Component {
  constructor(props) {
    super(props)
    Mixpanel.track('Orders Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('Orders Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    Mixpanel.track('Orders Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  render() {
    return (
      <>
        <Dashheader title="Orders" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            Orders
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default Orders;
