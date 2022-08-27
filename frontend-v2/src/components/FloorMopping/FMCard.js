
import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col, Button, Modal } from "reactstrap";
import { Link } from 'react-router-dom';
import handleDateRange from "utilFunctions/handleDateRange";

import axios from "axios";

import { nodeBaseURL } from "ApiURL";
import { getConvertedTime, hour12Format } from "utilFunctions/getConvertedTime";

class FMCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
            lastMopped: 0,
            time: this.props.time,
            daterange: "day",
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            userPosition: localStorage.getItem('rootState').position,
            tooltipState: false
        };
        this._ismounted = true;
    }

    toggle = () => {
        this.setState((prev) => {
            return { tooltipState: !prev.tooltipState };
        });
    };

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `mopping/list/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                let filterFloorMopping = res.data.filter(item => item.mopping_status);
                this._ismounted && this.setState({
                    lastMopped: filterFloorMopping.reverse()[0] ? `Last Mopped at ${getConvertedTime(filterFloorMopping[0].timestamp, this.props.outletTimezone, hour12Format)}` : 'Mopping Status Unavailable',
                    daterange: handleDateRange(nextProps.time, this.props.outletTimezone)
                });

                console.log(res.data);
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
                                Floor Mopping
                            </CardTitle>
                            <div className="mt-3 mb-2">
                                <Row>
                                    <Col md="12">
                                        <span className="h5 font-weight-bold mb-0pl-3">
                                            <span className="h5 text-bold">
                                                {this.state.lastMopped}
                                            </span>{" "}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <i className="fas fa-broom" />
                            </div>
                        </Col>
                    </Row>
                    <div className="mt-2 mb-0 text-sm">
                        <div className="mt-1">
                            {/* <span id="TooltipExample">
                                <Button
                                    // className="disabled-modal"
                                    color="secondary"
                                    outline
                                    type="button"
                                    size="sm"
                                    disabled
                                    onClick={() => this.toggleModal("exampleModal")}
                                >
                                    <span className="text-info">
                                        <i className="fa fa-question-circle" /> Learn More
                                    </span>{" "}
                                </Button>
                            </span>
                            <Tooltip placement="right" isOpen={this.state.tooltipState} target="TooltipExample" toggle={this.toggle.bind(this)}>
                                Disabled
                            </Tooltip> */}

                            <Link to="/admin/floor-moppping">
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
                                        Floor Mopping
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