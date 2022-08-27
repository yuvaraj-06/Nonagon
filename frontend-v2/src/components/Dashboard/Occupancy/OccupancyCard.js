import React, { Component } from "react";
import {
    Card,
    CardBody,
    Row,
    CardTitle,
    Col,
    Modal,
    Button,
    Tooltip
    // Popover, PopoverHeader, PopoverBody
} from "reactstrap";

import Graph from "./Graph";
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

class OccupancyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
            data: 0,
            outlet: this.props.outlet,
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

    toggle = () => this.setState({ popoverOpen: !this.state.popoverOpen });

    fetchData = (nextProps) => {
        axios.get(
            nodeBaseURL +
            `room_occupancy/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                this._ismounted && this.setState({
                    data: res.data.room_occupancy_avg,
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

    toggleModal = (state) => {
        this._ismounted && this.setState({
            [state]: !this.state[state],
        });
    };

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <Card className="card-stats">
                    <CardBody>
                        <Row>
                            <div className="col">
                                <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                    Room Occupancy (Average People Present)
                                </CardTitle>
                                <div className="mt-3 mb-2">
                                    <Row>
                                        <Col md="12">
                                            <span className="h2 font-weight-bold mb-0pl-3">
                                                <span className="text-info">
                                                    <i className="fas fa-arrow-circle-up" />
                                                </span>{" "}
                                                {this.state.data.toFixed(0)}
                                            </span>
                                            {/* &nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="h3 font-weight-bold mb-0pl-3">
                                                <span className="text-info">
                                                    <i className="fas fa-arrow-circle-down" />
                                                </span>{" "}
                                                {this.state.data.unoccupied}
                                            </span> */}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <Col className="col-auto">
                                <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                    <i className="fas fa-arrow-circle-up" />
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
                                    id='learnmore'
                                    onClick={() => this.toggleModal("exampleModal")}
                                >
                                    <span className="text-info">
                                        <i className="fa fa-question-circle" /> Learn More
                                    </span>{" "}
                                </Button>
                                <Link to='/admin/room-occupancy'>
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
                                <div className="explr-i" id="explr-tooltip-OC">
                                    <i className=" fas fa-info" />
                                </div>
                                <Tooltip
                                    placement="top-start"
                                    isOpen={this.state.tooltipOpen}
                                    target="explr-tooltip-OC"
                                    toggle={() => this.toggleTooltip()}
                                >
                                    Shows the average number of people present in a given camera's field of view.
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
                                            Room Occupancy
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
                                                {/* <LiveFeed mlPort={"ws-std-sop-cam4"} /> */}
                                            </Col>
                                        </Row>
                                    }

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
                                    <ComparisonGraph
                                        dataType='Count'
                                        route='room_occupancy/hourwise'
                                        outletCode={this.props.outlet}
                                    />
                                </div>
                            </Modal>
                        </div>
                    </CardBody>
                </Card>
                {/* <Popover placement="left" trigger="focus" isOpen={this.state.popoverOpen} target="learnmore" toggle={this.toggle}>
                    <PopoverHeader>Popover Title</PopoverHeader>
                    <PopoverBody>
                        Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
                    </PopoverBody>
                </Popover> */}
            </div>
        );
    }
}

//export default OccupancyCard;

export default connect(
    mapStateToProps,
)(OccupancyCard);
