import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col, Modal, Button, Tooltip } from "reactstrap";
import handleDateRange from "utilFunctions/handleDateRange";

import axios from "axios";

import { nodeBaseURL } from "ApiURL";
import CardHeader from "reactstrap/lib/CardHeader";
import Graph from "./Graph";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    outletCameraDetails: state.outletCode.outletCameraDetails,
    companyServices: state.services.companyServices,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class TVSCustomerTimeInsightsCard2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      avg_lounge_timespent: 0,
      avg_discussion_timespent: 0,
      avg_insurance_timespent: 0,
      time: this.props.time,
      daterange: "day",
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      userPosition: localStorage.getItem("rootState").position,
    };
    this._ismounted = true;
  }

  toggleTooltip = () => {
    this._ismounted &&
      this.setState({
        tooltipOpen: !this.state.tooltipOpen,
      });
  };

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `tvs_timespent2/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          this._ismounted &&
            this.setState({
              avg_lounge_timespent: (
                res.data.avg_lounge_timespent / 60
              ).toFixed(2),
              avg_discussion_timespent: (
                res.data.avg_discussion_timespent / 60
              ).toFixed(2),
              avg_insurance_timespent: (
                res.data.avg_insurance_timespent / 60
              ).toFixed(2),
              daterange: handleDateRange(nextProps.time, this.props.outletTimezone),
            });
        })
        .catch((err) => { });
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
                Average Time Spent
              </CardTitle>
              <div className="mt-2 mb-1">
                <Row>
                  <Col xs="4" sm="4">
                    <span className="h5 font-weight-bold mb-0 text-nowrap">
                      <span className="h5 text-red">
                        Lounge
                        <br />
                        Area
                      </span>
                      <br />
                      {this.state.avg_lounge_timespent}
                    </span>
                  </Col>

                  <Col xs="4" sm="4">
                    <span className="h5 font-weight-bold mb-0 text-nowrap">
                      <span className="h5 text-info">
                        Discussion
                        <br />
                        Tables
                      </span>
                      <br />
                      {this.state.avg_discussion_timespent}
                    </span>
                  </Col>

                  {Object.keys(this.props.companyServices)[0] !== "GVTPL-KMTTSIN001" ?
                    <Col xs="4" sm="4">
                      <span className="h5 font-weight-bold mb-0 text-nowrap">
                        <span className="h5 text-orange">
                          Insurance and
                          <br />
                          Billing Counters
                        </span>
                        <br />
                        {this.state.avg_insurance_timespent}
                      </span>
                    </Col>
                    : null}
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
              <Link to='/admin/region-insights'>
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
          <Col>
            <div className="explr-i" id="explr-tooltip-CTI">
              <i className=" fas fa-info" />
            </div>
            <Tooltip
              placement="top-start"
              isOpen={this.state.tooltipOpen}
              target="explr-tooltip-CTI"
              toggle={() => this.toggleTooltip()}
            >
              The average time (in mins) spent by the customer at different regions. For reference image click learn more button.
            </Tooltip>
          </Col>
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
            <div className="modaltime-body ml-4 mr-4">
              {this.props.outlet === 'TNDRC-MAATNIN001' ?
                < Card >
                  <CardHeader>
                    <span className='h4'>Average customer time spent zone reference</span>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col className="text-center mt-4">
                        <img
                          className="img-responsive"
                          width='100%'
                          height='100%'
                          src='https://nonagon-client-notification-video-archive.s3.ap-south-1.amazonaws.com/Images/customer_regions.jpeg'
                          alt="Average customer time spent zone reference"
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                :
                null}
              <Graph />
            </div>
          </Modal>
        </CardBody>
      </Card >
    );
  }
}

// export default TVSCustomerTimeInsightsCard2;
export default connect(mapStateToProps)(TVSCustomerTimeInsightsCard2);