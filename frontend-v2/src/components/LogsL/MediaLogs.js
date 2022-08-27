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
} from "reactstrap";
// import { CSVLink } from "react-csv";
import { isURL } from "utilFunctions/isURL";
class MediaLogs extends Component {
  constructor(props) {
    super(props);
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
    });
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
                      {this.props.logsName} Logs ({this.props.logsData.length})
                    </h3>
                  </Col>
                  <Col className="text-right">
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
                <div className="text-left">
                  <Table responsive>
                    <thead>
                      <tr>
                        {this.state.logsColumnName.map((item, index) => {
                          return <th key={index}>{item}</th>;
                        })}
                      </tr>
                    </thead>

                    <tbody>
                      {this.props.logsData.map((item, index) => {
                        return (
                          <tr key={index}>
                            {this.state.logsDataField.map((data, i) => {
                              if (data === "timestamp") {
                                return <td key={i}>{item[data]}</td>;
                              }
                              if (data === "media") {
                                return (
                                  <td key={i}>
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          modalData: [item],
                                        });
                                        this.toggleModal("exampleModal");
                                      }}
                                    >
                                      <i className="fas fa-eye text-info"></i>
                                    </Button>
                                  </td>
                                );
                              }
                              return <td key={i}>{item[data]}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
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
                                  return <td key={i}>{item[data]}</td>;
                                }
                                if (data === "media") {
                                  return <td key={i}>Check Media Below</td>;
                                }
                                return (
                                  <td key={i}>
                                    {item[data] ? item[data].toString() : null}
                                  </td>
                                );
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

export default MediaLogs;
