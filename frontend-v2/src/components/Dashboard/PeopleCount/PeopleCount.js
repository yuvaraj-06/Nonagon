import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col, Button, Modal } from "reactstrap";


import Graph from "./Graph";
import CamwisePeopleCount from "./CamwisePeopleCount";
import axios from "axios";
import handleDateRange from 'utilFunctions/handleDateRange';

import { nodeBaseURL } from "../../../ApiURL";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import ComparisonGraph from "components/HourWiseComparison/ComparisonGraph";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
};

class PeopleCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
            noofpeople: 0,
            time: this.props.time,
            daterange: "day",
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            userPosition: localStorage.getItem('rootState').position
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `customers/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                this._ismounted && this.setState({
                    noofpeople: Math.round(res.data.people_count_avg),
                    daterange: handleDateRange(nextProps.time, this.props.outletTimezone)
                });
            })
            .catch(err => {

            });
    };

    componentDidMount() {
        this.fetchData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                time: nextProps.time,
            });
            this.fetchData(nextProps);
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    toggleModal = (state) => {
        this._ismounted && this.setState({
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
                                People Count
                                {/* for {this.props.time !== 'None' ? this.props.time : new Date(this.props.startDate).toLocaleDateString() + ' to ' + new Date(this.props.endDate).toLocaleDateString()} */}
                            </CardTitle>
                            <div className="mt-3 mb-2">
                                <Row>
                                    <Col md="12">
                                        <span className="h2 font-weight-bold ">
                                            <span className="text-info">
                                                <i className="fas fa-user-friends" />
                                            </span>{" "}
                                            {this.state.noofpeople}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <i className="fas fa-user-friends" />
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
                            <Link to='/admin/people-counter'>
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
                                        People Count
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
                                {this.state.userPosition !== "Admin" ? "" :
                                    <Row>
                                        <Col>
                                            {/* <LiveFeed mlPort={'ws-peoplecount'} /> */}
                                        </Col>
                                    </Row>
                                }
                                <Row>
                                    <Col>
                                        <CamwisePeopleCount drange={this.state.daterange} time={this.state.time} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Graph
                                            outlet={this.props.outlet}
                                            time={this.state.time}
                                            startDate={this.props.startDate}
                                            endDate={this.props.endDate}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Card className='ml-4 mr-4'>
                                        <CardTitle>
                                            <span className='h4'>
                                                As per your employee configurations, we are expecting a minimum of 10 people present in the store at any given point of time as your outlet has at least 10 employees.
                                            </span>
                                        </CardTitle>
                                    </Card>
                                </Row>

                                <ComparisonGraph
                                    dataType='Count'
                                    route='customers/hourwise'
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

//export default PeopleCount;

export default connect(
    mapStateToProps,
)(PeopleCount);