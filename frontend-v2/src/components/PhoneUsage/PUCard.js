import React, { Component } from "react";
import { Link } from 'react-router-dom';

import { Card, CardBody, Row, CardTitle, Col, Button, Modal, Tooltip } from "reactstrap";
import handleDateRange from "utilFunctions/handleDateRange";

import axios from "axios";

import { nodeBaseURL } from "ApiURL";

class FMCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
            employee_phone_usage_count: 0,
            time: this.props.time,
            daterange: "day",
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            userPosition: localStorage.getItem('rootState').position
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
        this._ismounted && axios.get(
            nodeBaseURL +
            `employee/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                this._ismounted && this.setState({
                    employee_phone_usage_count: res.data.employee_phone_usage_count,
                    daterange: handleDateRange(nextProps.time, this.props.outletTimezone)
                });
            })
            .catch(err => {

            });
    };

    componentDidMount() {
        handleDateRange(this.state.time, this.props.outletTimezone);
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
        handleDateRange(this.state.time, this.props.outletTimezone);
    };

    render() {
        return (
            <Card className="card-stats">
                <CardBody>
                    <Row>
                        <div className="col">
                            <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                Phone Usage Count
                            </CardTitle>
                            <div className="mt-3 mb-2">
                                <Row>
                                    <Col md="12">
                                        <span className="h2 font-weight-bold mb-0pl-3">
                                            <span className="text-info">
                                                <i className="fas fa-mobile-alt" />
                                            </span>{" "}
                                            {this.state.employee_phone_usage_count}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <i className="fas fa-mobile-alt" />
                            </div>
                        </Col>
                    </Row>
                    <div className="mt-2 mb-0 text-sm">
                        <div className="mt-1">
                            {/* /phone-usage */}
                            <Link to="/admin/phone-usage">
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
                            <div className="explr-i" id="explr-tooltip-PU">
                                <i className=" fas fa-info" />
                            </div>
                            <Tooltip
                                placement="top-start"
                                isOpen={this.state.tooltipOpen}
                                target="explr-tooltip-PU"
                                toggle={() => this.toggleTooltip()}
                            >
                                At every 4 minutes interval, the AI checks for phone usage activity at the billing counter and other areas of the outlet
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
                                        Phone Usage Count
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
                                {this.state.userPosition !== "admin" ? "" :
                                    <Row>
                                        <Col>
                                            {/* <LiveFeed mlPort={'ws-sd'} /> */}
                                        </Col>
                                    </Row>
                                }
                                <Row>
                                    <Col>
                                        {/* <Graph
                                            outlet={this.props.outlet}
                                            time={this.state.time}
                                            startDate={this.props.startDate}
                                            endDate={this.props.endDate}
                                        /> */}
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

export default FMCard;