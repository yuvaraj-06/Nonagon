import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col, Modal, Button } from "reactstrap";

import axios from "axios";
import handleDateRange from 'utilFunctions/handleDateRange';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { nodeBaseURL } from "ApiURL";
import Graph from "./Graph";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
};

class BagPrintCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
            time: this.props.time,
            daterange: handleDateRange(this.props.time, props.outletTimezone),
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            bagCount: {},
            userPosition: localStorage.getItem('rootState').position
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `bag_print/aggregate/${nextProps.outlet}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                this._ismounted && this.setState({ bagCount: res.data });
            })
            .catch(console.log);
    };

    componentDidMount() {
        this.fetchData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                time: nextProps.time,
                daterange: handleDateRange(nextProps.time, nextProps.outletTimezone)
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
                                Packaging Print Count
                            </CardTitle>
                            <div>
                                <Row className='mt-3'>
                                    <Col md="5">
                                        <span className="h4 font-weight-bold mb-0 text-nowrap">
                                            <center>
                                                <span className="h4 text-info">
                                                    Printed
                                                </span>
                                                <br />
                                                {this.state.bagCount.bag_print_true}
                                            </center>
                                        </span>
                                    </Col>
                                    <Col md="5">
                                        <span className="h4 font-weight-bold mb-0 text-nowrap">
                                            <center>
                                                <span className="h4 text-red">
                                                    Not Printed
                                                </span>
                                                <br />
                                                {this.state.bagCount.bag_print_false}
                                            </center>
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <span className='h5 text-muted m-auto'>
                                        <center>
                                            NOTE: Above {handleDateRange(this.state.time, this.props.outletTimezone)}
                                        </center>
                                    </span>
                                </Row>
                                <div className="pt-1">
                                    <Link to='/admin/bags-print-count'>
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
                            </div>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <i className="fas fa-shopping-bag" />
                            </div>
                        </Col>
                    </Row>
                    <div className="mt-2 mb-0 text-sm">
                        {/* <div className="mt-1">
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
                        </div> */}
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={this.state.exampleModal}
                            toggle={() => this.toggleModal("exampleModal")}
                            size="lg"
                        >
                            <div className="modal-header">
                                <span>
                                    <h4 className="modal-title" id="exampleModalLabel">
                                        Packaging Print
                                    </h4>
                                    <br />
                                    <h4 className="h4 text-muted">{this.state.daterange}</h4>
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
                                <Graph />
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
)(BagPrintCard);