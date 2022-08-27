import React from "react";

import { CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import handleDateRange from "utilFunctions/handleDateRange";
import { connect } from "react-redux";
import TVSGraph2 from "components/TVSBK2/Graph";

const mapStateToProps = (state) => {
  return {
    time: state.time.time,
  };
};

class TVSCustomerTimeInsightsGraph2 extends React.Component {

  render() {
    return (
      <div>
        <Row>
          <div className="col">
            <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
              Customer Time Insights
              <br />
              <span className="h4 text-muted">
                ({handleDateRange(this.props.time)})
              </span>
            </CardTitle>
          </div>
        </Row>
        <CardBody className='mp-0'>
          <Container className="mt-3" fluid>
            <Row>
              <Col lg="12">
                <TVSGraph2 />
              </Col>
            </Row>
          </Container>
        </CardBody>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TVSCustomerTimeInsightsGraph2);
