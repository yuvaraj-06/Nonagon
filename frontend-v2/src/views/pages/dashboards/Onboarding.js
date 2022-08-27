import React from "react";
import {
  Container
} from 'reactstrap'

import Dashheader from 'components/Headers/DashheaderNTS'
import OnboardingForm from "components/Onboarding/OnboardingForm";
import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
class Onboarding extends React.Component {
  constructor(props) {
    super(props)
    Mixpanel.track('Onboarding Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('Onboarding Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    Mixpanel.track('Onboarding Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  render() {
    return (
      <>
        <Dashheader title="Onboarding" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <OnboardingForm />
          </ErrorBoundary>
        </Container>
        {/* <h2 align='center'>We are cooking this for you.</h2> */}
      </>
    );
  }
}

export default Onboarding;
