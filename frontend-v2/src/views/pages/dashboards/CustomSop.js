import React from "react";
import {
  Container,
} from 'reactstrap'

import Dashheader from 'components/Headers/Dashheader'
import CustomSOPComponent from 'components/CustomSOP/CustomSOP.js';

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

class CustomSop extends React.Component {
  constructor(props) {
    super(props)
    Mixpanel.track('CustomSOP Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('CustomSOP Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    Mixpanel.track('CustomSOP Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  render() {
    return (
      <>
        <Dashheader title="Custom SOP" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <CustomSOPComponent />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default CustomSop;
