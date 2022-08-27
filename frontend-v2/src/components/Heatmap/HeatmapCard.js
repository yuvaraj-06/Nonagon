import React, { Component } from "react";

import {
  Card,
  CardBody,
  Row,
  CardTitle,
  Col,
  Button,
  Modal,
  Table,
  Tooltip
} from "reactstrap";
import handleDateRange from "utilFunctions/handleDateRange";

import axios from "axios";

import { nodeBaseURL } from "ApiURL";
import { getConvertedTime } from "utilFunctions/getConvertedTime";
import { isURL } from "utilFunctions/isURL";
import { connect } from "react-redux";
import { hour12Format } from "utilFunctions/getConvertedTime";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
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
    dataField: "media",
    text: "Heatmap Image",
    sort: false,
  },
];
class HeatmapCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      heatmapData: [
        {
          timestamp: "",
          camera_location: "",
          heatmapStatus: "",
          screenshot: "",
        },
      ],
      time: this.props.time,
      daterange: "day",
      startDate: this.props.startDate,
      endDate: this.props.endDate,
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
          `heatmap/list/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          this._ismounted &&
            this.setState({
              heatmapData: res.data.reverse()[0]
                ? res.data
                : [
                  {
                    timestamp: "",
                    camera_location: "",
                    heatmapStatus: "",
                    screenshot: "",
                  },
                ],
              modalData: res.data[0]
                ? [res.data[0]]
                : [
                  {
                    timestamp: "",
                    camera_location: "",
                    heatmapStatus: "",
                    screenshot: "",
                  },
                ],
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
    handleDateRange(this.state.time, this.props.outletTimezone);
  };

  render() {
    return (
      <Card className="card-stats">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                Heatmap
              </CardTitle>
              <div className="mt-3 mb-2">
                <Row>
                  <Col>
                    <span className="h5 font-weight-bold mb-0pl-3">
                      <span className="h5 text-info"></span>{" "}
                      {this.state.heatmapData[0].timestamp !== ""
                        ? `Last Updated at ${getConvertedTime(
                          this.state.heatmapData[0].timestamp,
                          this.props.outletTimezone,
                          hour12Format
                        )}`
                        : "Status Unavailable"}
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fas fa-map-signs" />
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
              <Link to='/admin/heatmap'>
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
            <Col>
              <div className="explr-i" id="explr-tooltip-Heatmap">
                <i className=" fas fa-info" />
              </div>
              <Tooltip
                placement="top-start"
                isOpen={this.state.tooltipOpen}
                target="explr-tooltip-Heatmap"
                toggle={() => this.toggleTooltip()}
              >
                Visual heatmap of the store depiciting intensity of people presence in different areas of the store.
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
                    Heatmap
                  </h4>
                  {/* <br /> */}
                  {/* <h4 className="h4 text-muted">({this.state.daterange})</h4> */}
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
                <Row>
                  <Col>
                    <Card>
                      <CardBody>
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
                              alt={"Heatmap media"}
                              src={`${!isURL(this.state.modalData[0].screenshot)
                                ? "data:image/png;base64,"
                                : ""
                                }${this.state.modalData[0].screenshot}`}
                              width="100%"
                              height="100%"
                            />
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Modal>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(HeatmapCard);
