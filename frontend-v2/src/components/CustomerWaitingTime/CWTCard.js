import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col, Button, Modal } from "reactstrap";
import handleDateRange from "utilFunctions/handleDateRange";

import axios from "axios";

import { nodeBaseURL } from "ApiURL";

class CustomerWaitingTimeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      avg_display_counter_timespent: 0,
      avg_billing_counter_timespent: 0,
      avg_waiting_around_timespent: 0,
      time: this.props.time,
      daterange: "day",
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      userPosition: localStorage.getItem("rootState").position,
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `avg_time_spent/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          this._ismounted &&
            this.setState({
              avg_display_counter_timespent:
                res.data.avg_display_counter_timespent,
              avg_billing_counter_timespent:
                res.data.avg_billing_counter_timespent,
              avg_waiting_around_timespent:
                res.data.avg_waiting_around_timespent,
              daterange: handleDateRange(nextProps.time, this.props.outletTimezone),
            });
        })
        .catch((err) => { });
  };

  componentDidMount() {
    handleDateRange(this.state.time, this.props.outletTimezone);
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

  toggleModal = (state) => {
    this._ismounted &&
      this.setState({
        [state]: !this.state[state],
      });
    handleDateRange(this.state.time, this.props.outletTimezone);
  };

  render() {
    return (
      <Card className="card-stats ppe-card">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                Customer Average Time
              </CardTitle>
              <div className="mt-2 mb-1">
                <Row>
                  <Col xs="4" sm="4">
                    <span className="h3 font-weight-bold mb-0 text-nowrap">
                      <span className="h5 text-red">
                        Display
                        <br />
                        Counter
                      </span>
                      <br />
                      {this.state.avg_display_counter_timespent / 60}
                    </span>
                  </Col>

                  <Col xs="4" sm="4">
                    <span className="h3 font-weight-bold mb-0 text-nowrap">
                      <span className="h5 text-info">
                        Billing
                        <br />
                        Counter
                      </span>
                      <br />
                      {this.state.avg_billing_counter_timespent / 60}
                    </span>
                  </Col>

                  <Col xs="4" sm="4">
                    <span className="h3 font-weight-bold mb-0 text-nowrap">
                      <span className="h5 text-orange">
                        Waiting
                        <br />
                        Time
                      </span>
                      <br />
                      {this.state.avg_waiting_around_timespent / 60}
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fas fa-user-clock"></i>
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
                  Customer Average Time
                </h4>
                <br />
                <h4 className="h4 text-muted">
                  ({handleDateRange(this.state.time, this.props.outletTimezone)})
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
              {/* <Row>
                <Col className="text-center">
                  <Button
                    color={"primary"}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ comparisonGraphFeature: "hairnet" });
                    }}
                  >
                    Hairnet
                  </Button>
                  <Button
                    color={"primary"}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ comparisonGraphFeature: "gloves" });
                    }}
                  >
                    Gloves
                  </Button>
                  <Button
                    color={"primary"}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ comparisonGraphFeature: "mask" });
                    }}
                  >
                    Mask
                  </Button>
                </Col>
              </Row>
              <br />
              <Col className="text-center">
                {this.state.comparisonGraphFeature === "hairnet" ? (
                  <div>
                    <Col>
                      <HairnetGraph
                        outlet={this.props.outlet}
                        time={this.props.time}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                      />
                    </Col>
                    <Col>
                      <ComparisonGraph
                        dataType="Hairnet Deviations"
                        route="sopDeviation/hourwise/hairnet"
                        outletCode={this.props.outlet}
                      />
                    </Col>
                  </div>
                ) : this.state.comparisonGraphFeature === "gloves" ? (
                  <div>
                    <Col>
                      <GlovesGraph
                        outlet={this.props.outlet}
                        time={this.props.time}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                      />
                    </Col>
                    <Col>
                      <ComparisonGraph
                        dataType="Glove Deviations"
                        route="sopDeviation/hourwise/gloves"
                        outletCode={this.props.outlet}
                      />
                    </Col>
                  </div>
                ) : this.state.comparisonGraphFeature === "mask" ? (
                  <div>
                    <Col>
                      <MaskGraph
                        outlet={this.props.outlet}
                        time={this.props.time}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                      />
                    </Col>
                    <Col>
                      <ComparisonGraph
                        dataType="Mask Deviations"
                        route="sopDeviation/hourwise/mask"
                        outletCode={this.props.outlet}
                      />
                    </Col>
                  </div>
                ) : null}
              </Col> */}
            </div>
          </Modal>
        </CardBody>
      </Card>
    );
  }
}

export default CustomerWaitingTimeCard;
