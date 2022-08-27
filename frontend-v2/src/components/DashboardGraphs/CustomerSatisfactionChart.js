import React, { Component } from "react";

import { Row, CardTitle, Col, CardBody, Container } from "reactstrap";

import handleDateRange from "utilFunctions/handleDateRange";

import getPopulatedGraphData, { convertCAData } from "utilFunctions/getPopulatedGraphData";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";

import axios from 'axios';
import { nodeBaseURL } from "ApiURL";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import Chart from "components/CustomerSatisfaction/Chart";

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        companyServices: state.services.companyServices,
        outletCode: state.outletCode.outletCode
    };
};

class CustomerSatisfactionChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp: [],
            attended: [],
            unattended: []
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `customers_attended/list/${nextProps.outletCode}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )

            .then((result) => {

                var attendedData = getPopulatedGraphData(getGraphTimeFrame(nextProps.time), convertCAData(result.data, 'attended'), this.props.time);
                var unattendedData = getPopulatedGraphData(getGraphTimeFrame(nextProps.time), convertCAData(result.data, 'unattended'), this.props.time);

                var attended = Object.values(attendedData);
                var unattended = Object.values(unattendedData);
                var timestamp = Object.keys(attendedData);

                this._ismounted && this.setState({
                    timestamp,
                    attended,
                    unattended
                });
            })
            .catch(console.log);
    };

    componentDidMount() {
        this.fetchData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.fetchData(nextProps);
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {

        return (
            <div>
                <Row>
                    <div className="col">
                        <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
                            Customer Emotions
                            <br />
                            <span className="h4 text-muted">
                                ({handleDateRange(this.props.time)})
                            </span>
                        </CardTitle>
                    </div>
                </Row>
                <CardBody className='mp-0'>
                    <Container className="mt-3" fluid>
                        <Row>
                            <Col lg="12">
                                <Chart />
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </div >
        );
    }
}

//export default Graph;

export default connect(
    mapStateToProps,
)(CustomerSatisfactionChart);