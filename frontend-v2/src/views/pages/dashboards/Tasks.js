import React from "react";
import {
  Container,
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import CRUDTable from "components/Tasks/CRUDTable"

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
class Tasks extends React.Component {
  constructor(props) {
    super(props)
    Mixpanel.track('Tasks Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('Tasks Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    Mixpanel.track('Tasks Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  render() {
    return (
      <>
        <Dashheader title="Tasks" />

        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <CRUDTable />
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default Tasks;
