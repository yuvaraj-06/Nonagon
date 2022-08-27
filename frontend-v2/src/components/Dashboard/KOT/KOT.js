import React, { Component } from "react";
import { Card, CardBody, Row, CardTitle, Col, Button, Modal } from "reactstrap";

import Graph from "./Graph";
import axios from "axios";
import handleDateRange from "utilFunctions/handleDateRange";
import { Link } from "react-router-dom";
import { nodeBaseURL } from "../../../ApiURL";

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    outletTimezone: state.outletCode.outletTimezone,
  };
};

class KOT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleModal: false,
      nooforders: 0,
      outlet: this.props.outlet,
      time: this.props.time,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      daterange: "day",
      userPosition: localStorage.getItem("rootState").position,
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    axios
      .get(
        nodeBaseURL +
          `kot_pos_data/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("act")}`,
          },
        }
      )
      .then((res) => {
        this._ismounted &&
          this.setState({
            nooforders: res.data.number_of_orders,
            daterange: handleDateRange(
              nextProps.time,
              this.props.outletTimezone
            ),
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
      <Card className="card-stats">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                Number of Orders
              </CardTitle>
              <div className="mt-3 mb-2">
                <Row>
                  <Col md="12">
                    <span className="h2 font-weight-bold mb-0pl-3">
                      <span className="text-info">
                        <i className="fas fa-ticket-alt" />
                      </span>{" "}
                      {this.state.nooforders}
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                <i className="fas fa-ticket-alt" />
              </div>
            </Col>
          </Row>
          <div className="mt-2 mb-0 text-sm">
            <div className="mt-1">
              <Link to="/admin/kot">
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
            <Modal
              className="modal-dialog-centered"
              isOpen={this.state.exampleModal}
              toggle={() => this.toggleModal("exampleModal")}
              size="lg"
            >
              <div className="modal-header">
                <span>
                  <h4 className="modal-title" id="exampleModalLabel">
                    Kitchen Order Ticket
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
                {this.state.userPosition !== "Admin" ? (
                  ""
                ) : (
                  <Row>
                    <Col>{/* <LiveFeed mlPort={'ws-kot'} /> */}</Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    <Graph
                      outlet={this.state.outlet}
                      time={this.state.time}
                      startDate={this.props.startDate}
                      endDate={this.props.endDate}
                    />
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

//export default KOT;

export default connect(mapStateToProps)(KOT);
