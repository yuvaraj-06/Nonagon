import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col, Button, Modal, Table, Tooltip } from "reactstrap";
import { isURL } from "utilFunctions/isURL";
// import Graph from "./Graph";

import axios from "axios";

import { nodeBaseURL } from "../../ApiURL";

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import ComparisonGraph from "components/HourWiseComparison/ComparisonGraph";
import { getConvertedTime } from "utilFunctions/getConvertedTime";
import handleDateRange from "utilFunctions/handleDateRange";
import { hour12Format } from "utilFunctions/getConvertedTime";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    outletCameraDetails: state.outletCode.outletCameraDetails,
    companyServices: state.services.companyServices,
    outletCode: state.outletCode.outletCode,
    outletTimezone: state.outletCode.outletTimezone
  };
};

const logsColumnInfo = [
  {
    dataField: "timestamp",
    text: "Timeframe",
    sort: true,
  },
  {
    dataField: "camera_location",
    text: "Camera Location",
    sort: false,
  },
  {
    dataField: "manned_status",
    text: "Unmanned Status",
    sort: false,
  },
  // {
  //   dataField: "duration",
  //   text: "Duration (in sec)",
  //   sort: false,
  // },
  {
    dataField: "media",
    text: "Media",
    sort: false,
  },
];
class EmployeePresence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      data: "Loading...",
      time: this.props.time,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      outlet: this.props.outlet,
      daterange: "day",
      userPosition: localStorage.getItem("rootState").position,
      logsDataField: logsColumnInfo.map((item) => {
        return item.dataField;
      }),
      logsColumnName: logsColumnInfo.map((item) => {
        return item.text;
      }),
      modalData: [
        {
          media: "",
          timestamp: "",
        },
      ],
      timeZone: props.companyServices[props.outletCode]
        ? props.companyServices[props.outletCode].timezone
        : null,
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
          `employee_presence/list/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          var filteredArray = res.data.filter(item => item.manned_status === false).reverse();
          this._ismounted &&
            this.setState({
              data: filteredArray[0]
                ? `Last Unmanned at ${getConvertedTime(filteredArray[0].timestamp, nextProps.outletTimezone, hour12Format)}`
                : "Last Unmanned Unavailable",
              daterange: handleDateRange(nextProps.time, nextProps.outletTimezone),
              modalData: [filteredArray[0]].map(item => {
                return ({
                  timestamp: item.timestamp,
                  camera_location: item.camera_location,
                  screenshot: item.screenshot,
                  manned_status: item.manned_status ? 'Manned' : "Unmanned"
                });
              })
            });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted &&
        this.setState({
          time: nextProps.time,
          timeZone: nextProps.companyServices[nextProps.outletCode]
            ? nextProps.companyServices[nextProps.outletCode].timezone
            : null,
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
  };

  render() {
    return (
      <Card className="card-stats billing-counter-card">
        <CardBody className='mp-0'>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                Employee Unavailable
              </CardTitle>
              {/* <ToastAlert /> */}
              <div className="mt-3 mb-2">
                <Row>
                  <Col>
                    <span className="h5 font-weight-bold mb-0pl-3">
                      <span className="h5 text-info"></span> {this.state.data}
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fas fa-male" />
              </div>
            </Col>
          </Row>
          <div className="mt-2 mb-0 text-sm">
            <div className="mt-1">
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
              <Link to='/admin/employee-presence'>
                <Button
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
            <Col>
              <div className="explr-i" id="explr-tooltip-BillingCounter">
                <i className=" fas fa-info" />
              </div>
              <Tooltip
                placement="top-start"
                isOpen={this.state.tooltipOpen}
                target="explr-tooltip-BillingCounter"
                toggle={() => this.toggleTooltip()}
              >
                At every 4 minutes interval, the AI checks if the employees are present at their designated location.
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
                    Employees Unavailable
                  </h4>
                  <br />
                  <h4 className="h4 text-muted">({this.state.daterange})</h4>
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
              <div className="modal-body">
                <Table responsive>
                  <thead>
                    <tr>
                      {this.state.logsColumnName.map((item, index) => {
                        return <th key={index}>{item}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.modalData.map((item, index) => {
                      return (
                        <tr key={index}>
                          {this.state.logsDataField.map((data, i) => {
                            if (data === "timestamp") {
                              return (
                                <td key={i}>
                                  {getConvertedTime(item[data], this.props.outletTimezone, hour12Format)}
                                </td>
                              );
                            }
                            if (data === "media") {
                              return <td key={i}>Check Media Below</td>;
                            }
                            if (data === "camera_location") {
                              return (
                                <td key={i}>
                                  {
                                    this.props.outletCameraDetails[
                                    item[data]
                                    ]
                                  }
                                </td>
                              );
                            }
                            return (
                              <td key={i}>
                                {item[data]
                                  ? item[data].toString()
                                  : null}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <br></br>
                <Row>
                  <Col className="text-center mt-4">
                    <img
                      alt={"Employee Not Present"}
                      src={`${!isURL(this.state.modalData[0].screenshot)
                        ? "data:image/png;base64,"
                        : ""
                        }${this.state.modalData[0].screenshot}`}
                      width="100%"
                      height="100%"
                    />
                  </Col>
                </Row>
                {/* <Row>
                  <Col>
                    <Graph
                      outlet={this.state.outlet}
                      time={this.state.time}
                      startDate={this.props.startDate}
                      endDate={this.props.endDate}
                    />
                  </Col>
                </Row> */}
                <br />
                <ComparisonGraph
                  dataType="Count"
                  route="employee_presence/hourwise"
                  outletCode={this.props.outlet}
                />
              </div>
            </Modal>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(EmployeePresence);
