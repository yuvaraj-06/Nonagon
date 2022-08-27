import React from "react";
import {
  Container
} from 'reactstrap'

import Dashheader from 'components/Headers/DashheaderNTS'

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from 'reactstrap'
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

// import Img1 from 'assets/img/contactus.svg'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import SupportForm from "components/Support/SupportForm";

class Support extends React.Component {
  constructor(props) {
    super(props)
    Mixpanel.track('Support Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    Mixpanel.time_event('Support Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  componentWillUnmount() {
    Mixpanel.track('Support Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
  }
  render() {
    return (
      <>
        <Dashheader title="Support" />
        <Container className="mt--6" fluid>
          <ErrorBoundary>
            <Row className="mt-4">
              <Col>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Ask for Support</CardTitle>
                  </CardHeader>
                  <CardBody className="text-center">
                    {/* <p className="ml-2 h2" style={{ fontWeight: '400' }}>support@nonagon.xyz</p> */}

                    <p className="h4 ml-2 my-4" style={{ fontWeight: '400' }}>We are here to help and look forward to any queries you might have. We look forward to hearing from you.</p>

                    {/* <img src={Img1} className="shaddow" alt="contact-us" style={{ width: '50%' }}></img> */}

                    <SupportForm />
                    <p className="mt-3">
                    </p>

                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ErrorBoundary>
        </Container>
      </>
    );
  }
}

export default Support;
