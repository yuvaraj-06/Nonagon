import React, { Component } from "react";
import {
  Card,
  CardBody,
  Row,
  CardTitle,
  Col,
  Modal,
  Button,
  Tooltip,
} from "reactstrap";
import Graph from "components/CustomerAttended/Graph";
import axios from "axios";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import { nodeBaseURL } from "ApiURL";
import handleDateRange from "utilFunctions/handleDateRange";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class CACard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      time: this.props.time,
      daterange: handleDateRange(this.props.time, this.props.outletTimezone),
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      customersData: {},
      userPosition: localStorage.getItem("rootState").position,
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `customers_attended/aggregate/${nextProps.outlet}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          this.setState({ customersData: res.data });
        })
        .catch(console.log);
  };

  toggleTooltip = () => {
    this._ismounted &&
      this.setState({
        tooltipOpen: !this.state.tooltipOpen,
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
          daterange: handleDateRange(nextProps.time, nextProps.outletTimezone),
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
      <Card className="card-stats">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                Customers Unattended
              </CardTitle>
              <div className="mt-3 mb-2">
                <Row>
                  <Col md="12">
                    <span className="h2 font-weight-bold mb-0pl-3">
                      <span className="text-info">
                        <i className="fa fa-id-badge" />
                      </span>{" "}
                      {this.state.customersData.unattended}
                    </span>
                  </Col>
                  {/* <Row>
                                        <i className="fa fa-id-badge" /> &nbsp;&nbsp;
                                        <p className="h2 mt-2">{this.state.customersData.attended}</p> */}
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fa fa-id-badge" />
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
              <Link to='/admin/customers-unattended'>
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
              <Col>
                <div className="explr-i" id="explr-tooltip-CA">
                  <i className=" fas fa-info" />
                </div>
                <Tooltip
                  placement="top-start"
                  isOpen={this.state.tooltipOpen}
                  target="explr-tooltip-CA"
                  toggle={() => this.toggleTooltip()}
                >
                  The AI detects if the Customer is not Attended during their
                  store presence
                </Tooltip>
              </Col>
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
                    Customers Unattended
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
                <Graph
                  outlet={this.state.outlet}
                  time={this.state.time}
                  startDate={this.props.startDate}
                  endDate={this.props.endDate}
                />
              </div>
            </Modal>
          </div>
        </CardBody>
      </Card>
    );
  }
}

//export default PeopleCount;

export default connect(mapStateToProps)(CACard);
