import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col, Modal, Button } from "reactstrap";

// import HairnetGraph from './HairnetGraph';
// import GlovesGraph from './GlovesGraph';
// import MaskGraph from './MaskGraph';

import axios from "axios";

import { nodeBaseURL } from "../../../ApiURL";

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import ComparisonGraph from "components/HourWiseComparison/ComparisonGraph";
import handleDateRange from "utilFunctions/handleDateRange";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    outletTimezone: state.outletCode.outletTimezone,
  };
};

class IPPECheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      helmet: 0,
      vest: 0,
      boots: 0,
      time: this.props.time,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      comparisonGraphFeature: "mask",
    };
    this._ismounted = true;
  }

  toggleModal = (state) => {
    this._ismounted &&
      this.setState({
        [state]: !this.state[state],
      });
  };

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
            `ppeDeviation/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          this._ismounted &&
            this.setState({
              helmet: res.data.helmet,
              vest: res.data.vest,
              boots: res.data.boots,
            });
        })
        .catch((err) => {});
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted &&
        this.setState({
          time: nextProps.time,
        });
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <Card className="card-stats ppe-card">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                PPE Deviations
              </CardTitle>
              <div className="mt-2 mb-1">
                <Row>
                  {this.props.act.services.includes("IPPE.HM") ? (
                    <Col xs="3" sm="3">
                      <span className="h3 font-weight-bold mb-0 text-nowrap">
                        <center>
                          <span className="h5 text-red">Helmet</span>
                          <br />
                          {this.state.helmet}
                        </center>
                      </span>
                    </Col>
                  ) : null}
                  {this.props.act.services.includes("IPPE.VE") ? (
                    <Col xs="3" sm="3">
                      <span className="h3 font-weight-bold mb-0 text-nowrap">
                        <center>
                          <span className="h5 text-info">Vest</span>
                          <br />
                          {this.state.vest}
                        </center>
                      </span>
                    </Col>
                  ) : null}
                  {this.props.act.services.includes("IPPE.BO") ? (
                    <Col xs="3" sm="3">
                      <span className="h3 font-weight-bold mb-0 text-nowrap">
                        <center>
                          <span className="h5 text-orange">Boots</span>
                          <br />
                          {this.state.boots}
                        </center>
                      </span>
                    </Col>
                  ) : null}
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="ni ni-check-bold"></i>
              </div>
            </Col>
          </Row>
          <div className="mb-0 text-sm">
            <div className="mt-2">
              <Button
                color="secondary"
                outline
                type="button"
                size="sm"
                onClick={() => this.toggleModal("exampleModal")}
              >
                <span className="text-info">
                  <i className="fa fa-question-circle" /> Learn More
                </span>{" "}
              </Button>
              <Link to="/admin/ippe">
                <Button
                  // className="disabled-modal"
                  color="secondary"
                  outline
                  type="button"
                  size="sm"
                >
                  <span className="text-info">
                    <i className="fas fa-paper-plane" /> Go To Page
                  </span>{" "}
                </Button>
              </Link>
            </div>
          </div>
          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.exampleModal}
            toggle={() => this.toggleModal("exampleModal")}
            size="lg"
          >
            <div className="modal-header">
              <span>
                <h4 className="modal-title" id="exampleModalLabel">
                  PPE Deviations
                </h4>
                <br />
                <h4 className="h4 text-muted">
                  ({handleDateRange(this.state.time, this.props.outletTimezone)}
                  )
                </h4>
              </span>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => this.toggleModal("exampleModal")}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modaltime-body">
              <Row>
                <Col className="text-center">
                  {this.props.act.services.includes("IPPE.HM") ? (
                    <Button
                      color={
                        this.state.comparisonGraphFeature === "helmet"
                          ? "primary"
                          : "white"
                      }
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ comparisonGraphFeature: "helmet" });
                      }}
                    >
                      Helmet
                    </Button>
                  ) : null}
                  {this.props.act.services.includes("IPPE.VE") ? (
                    <Button
                      color={
                        this.state.comparisonGraphFeature === "vest"
                          ? "primary"
                          : "white"
                      }
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ comparisonGraphFeature: "vest" });
                      }}
                    >
                      Vest
                    </Button>
                  ) : null}
                  {this.props.act.services.includes("IPPE.BO") ? (
                    <Button
                      color={
                        this.state.comparisonGraphFeature === "boots"
                          ? "primary"
                          : "white"
                      }
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ comparisonGraphFeature: "boots" });
                      }}
                    >
                      Boots
                    </Button>
                  ) : null}
                </Col>
              </Row>
              <br />
              <Col className="text-center">
                {this.state.comparisonGraphFeature === "helmet" ? (
                  <div>
                    <Col>
                      {/* <HairnetGraph
                        outlet={this.props.outlet}
                        time={this.props.time}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                      /> */}
                    </Col>
                    <Col>
                      {/* <ComparisonGraph
                        dataType="Hairnet Deviations"
                        route="sopDeviation/hourwise/hairnet"
                        outletCode={this.props.outlet}
                      /> */}
                    </Col>
                  </div>
                ) : this.state.comparisonGraphFeature === "vest" ? (
                  <div>
                    <Col>
                      {/* <GlovesGraph
                        outlet={this.props.outlet}
                        time={this.props.time}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                      /> */}
                    </Col>
                    <Col>
                      {/* <ComparisonGraph
                        dataType="Glove Deviations"
                        route="sopDeviation/hourwise/gloves"
                        outletCode={this.props.outlet}
                      /> */}
                    </Col>
                  </div>
                ) : this.state.comparisonGraphFeature === "boots" ? (
                  <div>
                    <Col>
                      {/* <MaskGraph
                        outlet={this.props.outlet}
                        time={this.props.time}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                      /> */}
                    </Col>
                    <Col>
                      {/* <ComparisonGraph
                        dataType="Mask Deviations"
                        route="sopDeviation/hourwise/mask"
                        outletCode={this.props.outlet}
                      /> */}
                    </Col>
                  </div>
                ) : null}
              </Col>
            </div>
          </Modal>
        </CardBody>
      </Card>
    );
  }
}

//export default IPPECheck;

export default connect(mapStateToProps)(IPPECheck);
