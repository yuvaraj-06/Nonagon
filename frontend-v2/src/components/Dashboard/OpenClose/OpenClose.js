import React, { Component } from "react";

import { Card, CardBody, Row, CardTitle, Col } from "reactstrap";

import axios from "axios";
import handleDateRange from 'utilFunctions/handleDateRange';

import { nodeBaseURL } from "../../../ApiURL";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
};

class OpenClose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
            open: '',
            close: '',
            time: "day",
            daterange: "day",
            userPosition: localStorage.getItem('rootState').position
        };
        this._ismounted = true;
    }

    toggleModal = (state) => {
        this._ismounted && this.setState({
            [state]: !this.state[state],
        });
    };

    fetchData = (nextProps) => {
        axios
            .get(
                nodeBaseURL +
                `timings/${nextProps.outlet}`,
                {
                    headers: {
                        'Authorization': `bearer ${localStorage.getItem('act')}`

                    }
                }
            )
            .then((res) => {
                this._ismounted && this.setState({
                    open: res.data.startTime,
                    close: res.data.endTime,
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

    render() {
        return (
            <Card className="card-stats open-close-card" style={{ paddingBottom: '30px' }}>
                <CardBody>
                    <Row>
                        <div className="col">
                            <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                Open and Close Timings
                            </CardTitle>
                            <div className="mt-4 mb-2" >
                                <Row>
                                    <Col lg="4" xl="5">
                                        <center>
                                            <span className="h2 text-info">
                                                <span className="h2 text-info">
                                                    <i className="fa fa-lock-open" />
                                                    {" "}
                                                </span>
                                                {this.state.open === '' || this.state.open === undefined
                                                    ? "Not Open"
                                                    : this.state.open}
                                            </span>
                                        </center>
                                    </Col>
                                    <Col lg="4" xl="5">
                                        <center>
                                            <span className="h2 text-red">
                                                <span className="h2 text-red">
                                                    <i className="fa fa-lock" />
                                                    {" "}
                                                </span>
                                                {this.state.close === '' || this.state.open === undefined
                                                    ? "Yet to Close"
                                                    : this.state.close}
                                            </span>
                                        </center>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <Col className="col-auto">
                            <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                <i className="fas fa-store" />
                            </div>
                        </Col>
                    </Row>
                    <div className="mt-1">
                        {/* <Link to="/admin/floor-moppping">
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
                        </Link> */}
                    </div>
                </CardBody>
            </Card>
        );
    }
}

//export default OpenClose;

export default connect(
    mapStateToProps,
)(OpenClose);