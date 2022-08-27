import React from "react";

import { CardBody, CardTitle, Container, Row, Col } from "reactstrap";

import handleDateRange from "utilFunctions/handleDateRange";

import getPopulatedGraphData, {
  convertCCData,
} from "utilFunctions/getPopulatedGraphData";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";

import axios from "axios";
import { nodeBaseURL } from "ApiURL";

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";

import Graph from "components/DeliveryRate/Graph";

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    companyServices: state.services.companyServices,
    outletCode: state.outletCode.outletCode,
  };
};

class CustomerConversionGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: [],
      bagPrintTrue: [],
      bagPrintFalse: [],
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `customers/delivery_agent/list/${nextProps.outletCode}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((result) => {
          var ccRateData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            convertCCData(result.data, "cc_rate"),
            this.props.time
          );

          let ccRate = Object.values(ccRateData);
          let timestamp = Object.keys(ccRateData);

          this._ismounted &&
            this.setState({
              timestamp,
              ccRate,
            });
        })
        .catch(console.log);
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <div>
        <Row>
          <div className="col">
            <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
              Delivery Rate
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
                <Graph />
              </Col>
            </Row>
          </Container>
        </CardBody>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(CustomerConversionGraph);
