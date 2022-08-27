import React, { Component } from "react";
import {
  Table,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  DropdownItem,
  DropdownMenu,
  Collapse,
} from "reactstrap";
import {
  getConvertedTime,
  hour12Format,
  onlyDateFormat,
  mediaLogsToTimeFormat,
} from "utilFunctions/getConvertedTime";
// import { CSVLink } from "react-csv";
import { isURL } from "utilFunctions/isURL";
import { connect } from "react-redux";
import { increaseTimeByNHours } from "utilFunctions/LogsL/getHourwiseSegregation";

const mapStateToProps = (state) => {
  return {
    companyServices: state.services.companyServices,
    time: state.time.time,
    outletCode: state.outletCode.outletCode,
    outletTimezone: state.outletCode.outletTimezone,
  };
};
class MediaLogs extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.logsData);
    this.state = {
      logsDataField: this.props.logsColumnInfo.map((item) => {
        return item.dataField;
      }),
      logsColumnName: this.props.logsColumnInfo.map((item) => {
        return item.text;
      }),
      logsName: this.props.logsName,
      logsData: this.props.logsData,
      modalData: [
        {
          media: "",
          timestamp: "",
        },
      ],
      exampleModal: false,
      filterBeingUsed: "No Filter",
      filterParameter: this.props.filterParameter,
      dynamicFilterArray: props.dynamicFilterArray,
      filteredLogsData: props.logsData,
      timestampCollapseKeys: [],
      toggleCollapse: null,
      timeZone: props.companyServices[props.outletCode]
        ? props.companyServices[props.outletCode].timezone
        : null,
      noData:
        props.logsData
          .map((timestampObject, index) => {
            return timestampObject.data.length;
          })
          .reduce((a, b) => a + b, 0) === 0
          ? true
          : false,
    };
    this._ismounted = true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      logsName: nextProps.logsName,
      logsDataField: nextProps.logsColumnInfo.map((item) => {
        return item.dataField;
      }),
      logsColumnName: nextProps.logsColumnInfo.map((item) => {
        return item.text;
      }),
      logsData: nextProps.logsData,
      dynamicFilterArray: nextProps.dynamicFilterArray,
      timeZone: nextProps.companyServices[nextProps.outletCode]
        ? nextProps.companyServices[nextProps.outletCode].timezone
        : null,
      noData:
        nextProps.logsData
          .map((timestampObject, index) => {
            return timestampObject.data.length;
          })
          .reduce((a, b) => a + b, 0) === 0
          ? true
          : false,
    });
    // console.log(nextProps.companyServices);
  }

  toggleModal = (state) => {
    this._ismounted &&
      this.setState({
        [state]: !this.state[state],
      });
  };

  componentWillUnmount() {
    this._ismounted = false;
  }

  filterNotificationsByParameter = (allLogsData, filterBeingUsed) => {
    if (filterBeingUsed === "No Filter") {
      return allLogsData;
    } else {
      return allLogsData.filter(
        (item) => item[this.state.filterParameter] === filterBeingUsed
      );
    }
  };

  toggleCollapse = (timestamp) => {
    this._ismounted &&
      this.setState({
        toggleCollapse: timestamp,
      });
  };

  getNumberOfFeatureObjectsInAllTimestamps = (logsData) => {
    let numberOfFeatureObjectsInAllTimestamps = 0;
    logsData.forEach((item) => {
      numberOfFeatureObjectsInAllTimestamps +=
        this.filterNotificationsByParameter(
          item.data,
          this.state.filterBeingUsed
        ).length;
    });
    return numberOfFeatureObjectsInAllTimestamps;
  };

  render() {
    return (
      <>
        <Row>
          <Col lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>
                    <h3 className="mb-0">
                      {this.props.logsName} Logs (
                      {this.getNumberOfFeatureObjectsInAllTimestamps(
                        this.props.logsData
                      )}
                      )
                    </h3>
                  </Col>
                  <Col className="text-right">
                    {this.state.dynamicFilterArray.length > 2 ? (
                      <UncontrolledDropdown nav>
                        <DropdownToggle
                          className="nav-link pr-0"
                          color=""
                          tag="a"
                        >
                          <Media className="align-items-center">
                            <Button size="sm">
                              <i className="fas fa-filter text-primary"></i>
                              &nbsp;&nbsp;
                              {this.state.filterBeingUsed}
                            </Button>
                          </Media>
                        </DropdownToggle>
                        <DropdownMenu right>
                          {this.state.dynamicFilterArray.map((item, index) => {
                            return (
                              <div key={index}>
                                <DropdownItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ filterBeingUsed: item });
                                  }}
                                >
                                  <span>{item}</span>
                                </DropdownItem>
                              </div>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    ) : null}
                    &nbsp;&nbsp;&nbsp;
                    {/* {
                                            this.props.logsData.length !== 0 ?
                                                <CSVLink
                                                    style={{ textDecoration: "none" }}
                                                    data={this.props.logsData}
                                                    ref={(r) => (this.surveyLink = r)}
                                                    filename={
                                                        this.props.logsName + " Logs " + new Date().toLocaleDateString("en-GB") +
                                                        " " +
                                                        new Date().toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }) +
                                                        ".csv"
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button size='sm' color='primary'>Download</Button>
                                                </CSVLink>
                                                :
                                                <span className='h4 text-muted'>Nothing to Download</span>
                                        } */}
                  </Col>
                </Row>
                <Row>
                  <h4 className="float-left h4 text-muted mt-4 ml-3">
                    ({this.props.daterange})
                  </h4>
                </Row>
              </CardHeader>
              <CardBody>
                {this.state.noData ? (
                  <h4 className="muted text-center">
                    No data available for the current timeframe
                  </h4>
                ) : (
                  this.state.logsData.map((timestampObject, index) => {
                    if (timestampObject.data.length !== 0) {
                      return (
                        <Table responsive key={index}>
                          <tbody>
                            <tr
                              className="mb-2 ml-2 mt-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                this.toggleCollapse(
                                  this.state.toggleCollapse !==
                                    timestampObject.timestamp
                                    ? timestampObject.timestamp
                                    : null
                                );
                              }}
                            >
                              <Row className="m-auto h4">
                                <Col>
                                  {this.state.toggleCollapse ===
                                  timestampObject.timestamp ? (
                                    <i class="fas fa-chevron-down text-primary"></i>
                                  ) : (
                                    <i class="fas fa-chevron-right text-primary"></i>
                                  )}
                                  &nbsp;&nbsp;
                                  {getConvertedTime(
                                    timestampObject.timestamp,
                                    this.props.outletTimezone,
                                    this.props.time === "day" ||
                                      this.props.time === "yesterday"
                                      ? hour12Format
                                      : onlyDateFormat
                                  )}
                                  {this.props.time === "day" ||
                                  this.props.time === "yesterday"
                                    ? " to " +
                                      getConvertedTime(
                                        increaseTimeByNHours(
                                          timestampObject.timestamp,
                                          1
                                        ),
                                        this.props.outletTimezone,
                                        mediaLogsToTimeFormat
                                      )
                                    : null}
                                  &nbsp;(
                                  {
                                    this.filterNotificationsByParameter(
                                      timestampObject.data,
                                      this.state.filterBeingUsed
                                    ).length
                                  }
                                  ) &nbsp;&nbsp; &nbsp;&nbsp;
                                </Col>
                                {this.state.dynamicFilterArray.map(
                                  (item, index) => {
                                    if (item !== "No Filter") {
                                      return (
                                        <div key={index}>
                                          <Col>
                                            <span>
                                              {item} (
                                              {
                                                timestampObject.data.filter(
                                                  (d) =>
                                                    d[
                                                      this.state.filterParameter
                                                    ] === item
                                                ).length
                                              }
                                              )
                                            </span>
                                          </Col>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }
                                )}
                              </Row>
                            </tr>
                          </tbody>
                          <Collapse
                            isOpen={
                              this.state.toggleCollapse ===
                              timestampObject.timestamp
                            }
                          >
                            <div className="mt-2">
                              <Table responsive>
                                <thead>
                                  <tr>
                                    {this.state.logsColumnName.map(
                                      (item, index) => {
                                        if (
                                          this.state.logsName ===
                                          "Kitchen Order Ticket"
                                        ) {
                                          if (
                                            [
                                              "KOT Number",
                                              "Invoice Number",
                                              "Restaurant Name",
                                              "Dispatched",
                                              "Media",
                                            ].includes(item)
                                          ) {
                                            return <th key={index}>{item}</th>;
                                          }
                                        } else {
                                          return <th key={index}>{item}</th>;
                                        }
                                      }
                                    )}
                                  </tr>
                                </thead>

                                <tbody>
                                  {this.filterNotificationsByParameter(
                                    timestampObject.data,
                                    this.state.filterBeingUsed
                                  ).map((featureLogObject, index) => {
                                    return (
                                      <tr key={index}>
                                        {this.state.logsDataField.map(
                                          (data, i) => {
                                            if (
                                              this.state.logsName ===
                                              "Kitchen Order Ticket"
                                            ) {
                                              if (
                                                [
                                                  "kot_number",
                                                  "invoice_number",
                                                  "restaurant_name",
                                                  "dispatched",
                                                  "media",
                                                ].includes(data)
                                              ) {
                                                if (data === "timestamp") {
                                                  return (
                                                    <td key={i}>
                                                      {getConvertedTime(
                                                        featureLogObject[data],
                                                        this.props
                                                          .outletTimezone,
                                                        this.props.time ===
                                                          "day" ||
                                                          this.props.time ===
                                                            "yesterday"
                                                          ? hour12Format
                                                          : this.props
                                                              .useHour12Format
                                                          ? hour12Format
                                                          : onlyDateFormat
                                                      )}
                                                    </td>
                                                  );
                                                } else if (data === "media") {
                                                  return (
                                                    <td key={i}>
                                                      <Button
                                                        size="sm"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          this.setState({
                                                            modalData: [
                                                              featureLogObject,
                                                            ],
                                                          });
                                                          this.toggleModal(
                                                            "exampleModal"
                                                          );
                                                        }}
                                                      >
                                                        <i className="fas fa-eye text-info"></i>
                                                      </Button>
                                                    </td>
                                                  );
                                                } else {
                                                  return (
                                                    <td key={i}>
                                                      {featureLogObject[data]}
                                                    </td>
                                                  );
                                                }
                                              }
                                            } else {
                                              if (data === "timestamp") {
                                                return (
                                                  <td key={i}>
                                                    {getConvertedTime(
                                                      featureLogObject[data],
                                                      this.props.outletTimezone,
                                                      this.props.time ===
                                                        "day" ||
                                                        this.props.time ===
                                                          "yesterday"
                                                        ? hour12Format
                                                        : this.props
                                                            .useHour12Format
                                                        ? hour12Format
                                                        : onlyDateFormat
                                                    )}
                                                  </td>
                                                );
                                              } else if (data === "media") {
                                                return (
                                                  <td key={i}>
                                                    <Button
                                                      size="sm"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        this.setState({
                                                          modalData: [
                                                            featureLogObject,
                                                          ],
                                                        });
                                                        this.toggleModal(
                                                          "exampleModal"
                                                        );
                                                      }}
                                                    >
                                                      <i className="fas fa-eye text-info"></i>
                                                    </Button>
                                                  </td>
                                                );
                                              } else {
                                                return (
                                                  <td key={i}>
                                                    {featureLogObject[data]}
                                                  </td>
                                                );
                                              }
                                            }
                                          }
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </Collapse>
                          <hr />
                        </Table>
                      );
                    } else {
                      return null;
                    }
                  })
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.exampleModal}
          toggle={() => this.toggleModal("exampleModal")}
          size="lg"
        >
          <div className="modal-header">
            <span>
              <h4 className="modal-title" id="exampleModalLabel">
                Log Details
              </h4>
              {/* <h4 className="surtitle">({this.state.daterange})</h4> */}
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
                                      {getConvertedTime(
                                        item[data],
                                        this.props.outletTimezone,
                                        this.props.time === "day" ||
                                          this.props.time === "yesterday"
                                          ? hour12Format
                                          : this.props.useHour12Format
                                          ? hour12Format
                                          : onlyDateFormat
                                      )}
                                    </td>
                                  );
                                } else if (data === "media") {
                                  return <td key={i}>Check Media Below</td>;
                                } else {
                                  return <td key={i}>{item[data]}</td>;
                                }
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <br></br>

                    {this.state.modalData[0].media ? (
                      this.state.modalData[0].media.includes(".mp4") ? (
                        <Row>
                          <video
                            width="100%"
                            height="100%"
                            controls
                            autoPlay
                            controlsList="nodownload"
                            preload="auto"
                          >
                            <source
                              src={this.state.modalData[0].media}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </Row>
                      ) : (
                        <Row>
                          <Col className="text-center mt-4">
                            <img
                              alt={`${this.state.logsName} media`}
                              src={`${
                                !isURL(this.state.modalData[0].media)
                                  ? "data:image/png;base64,"
                                  : ""
                              }${this.state.modalData[0].media}`}
                              width="100%"
                              height="100%"
                            />
                          </Col>
                        </Row>
                      )
                    ) : (
                      <Row>
                        <span className="h4 m-auto">Media Unavailable</span>
                      </Row>
                    )}
                    {/* commented because video is not changing without reopening modal */}
                    {/* <Row className='mt-4'>
                                            <Col className='text-left'>
                                                {this.state.notifications.indexOf(this.state.modalData) !== 0 ?
                                                    <Button onClick={this.prevNotif}><i class="fas fa-arrow-left"></i></Button>
                                                    :
                                                    null
                                                }
                                            </Col>
                                            <Col className='text-center'>
                                                {this.state.notifications.indexOf(this.state.modalData) + 1}
                                            </Col>
                                            <Col className='text-right'>
                                                {this.state.notifications.indexOf(this.state.modalData) !== this.state.notifications.length - 1 ?
                                                    <Button onClick={this.nextNotif}><i class="fas fa-arrow-right"></i></Button>
                                                    :
                                                    null
                                                }
                                            </Col>
                                        </Row> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps)(MediaLogs);
