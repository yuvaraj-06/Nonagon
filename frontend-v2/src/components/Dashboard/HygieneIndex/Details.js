import React, { Component } from 'react'

import {
    Card,
    CardBody,
    CardHeader,
    Row,
    Col
} from 'reactstrap'

import axios from 'axios'

import { nodeBaseURL } from '../../../ApiURL'

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        companyServices: state.services.companyServices,
        outletCode: state.outletCode.outletCode
    };
}

class Details extends Component {

    constructor(props) {
        super(props)
        this.state = {
            exampleModal: false,
            hairnet: 0,
            glove: 0,
            mask: 0,
            deviation_hairnet: 0,
            deviation_glove: 0,
            deviation_mask: 0,
            time: this.props.time,
            startDate: this.props.startDate,
            endDate: this.props.endDate
        }
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL + `sop/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then(res => {
                this._ismounted && this.setState({
                    hairnet: res.data.hairnet,
                    // / (res.data.hairnet + res.data.mask + res.data.gloves) * 100,
                    mask: res.data.mask,
                    // / (res.data.hairnet + res.data.mask + res.data.gloves) * 100,
                    glove: res.data.gloves,
                    // / (res.data.hairnet + res.data.mask + res.data.gloves) * 100
                })
            })
            .catch(err => {

            });
        this._ismounted && axios.get(
            nodeBaseURL + `sopDeviation/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then(res => {
                this._ismounted && this.setState({
                    deviation_hairnet: res.data.hairnet,
                    // / (res.data.hairnet + res.data.mask + res.data.gloves) * 100,
                    deviation_mask: res.data.mask,
                    // / (res.data.hairnet + res.data.mask + res.data.gloves) * 100,
                    deviation_glove: res.data.gloves,
                    // / (res.data.hairnet + res.data.mask + res.data.gloves) * 100
                })
            })
            .catch(err => {

            });
    }

    componentDidMount() {
        this.fetchData(this.props)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) { this.fetchData(nextProps) }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <>
                <Row>
                    <Col lg="6">
                        <Card>
                            <CardHeader>
                                <h5 className="h3 mb-0">SOP Detected</h5>
                            </CardHeader>

                            {
                                this.props.companyServices[this.props.outletCode] ?
                                    <CardBody>
                                        <Row>
                                            {
                                                this.props.companyServices[this.props.outletCode].services.includes("KPPE.HD") ?
                                                    <Col md="4" sm="4">
                                                        <span className="h5 font-weight-bold mb-0 text-nowrap">
                                                            <center>
                                                                <span className="h4 text-red">
                                                                    Hairnet
                                                                </span>
                                                                <br />
                                                                {this.state.hairnet > 0 ? `${this.state.hairnet.toFixed(0)}` : '-'}
                                                            </center>
                                                        </span>
                                                    </Col>
                                                    :
                                                    null
                                            }
                                            {
                                                this.props.companyServices[this.props.outletCode].services.includes("KPPE.FMD") ?
                                                    <Col md="4" sm="4">
                                                        <span className="h5 font-weight-bold mb-0 text-nowrap">
                                                            <center>
                                                                <span className="text-info">
                                                                    Masks
                                                                </span>
                                                                <br />
                                                                {this.state.mask > 0 ? `${this.state.mask.toFixed(0)}` : '-'}
                                                            </center>
                                                        </span>
                                                    </Col>
                                                    :
                                                    null
                                            }
                                            {
                                                this.props.companyServices[this.props.outletCode].services.includes("KPPE.GD") ?
                                                    <Col md="4" sm="4">
                                                        <span className="h5 font-weight-bold mb-0 text-nowrap">
                                                            <center>
                                                                <span className="text-orange">
                                                                    Gloves
                                                                </span>
                                                                <br />
                                                                {this.state.glove > 0 ? `${this.state.glove.toFixed(0)}` : '-'}
                                                            </center>
                                                        </span>
                                                    </Col>
                                                    :
                                                    null
                                            }
                                        </Row>
                                    </CardBody>
                                    :
                                    null
                            }
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card>
                            <CardHeader>
                                <h5 className="h3 mb-0">Deviations Detected</h5>
                            </CardHeader>

                            <CardBody>

                                {
                                    this.props.companyServices[this.props.outletCode] ?
                                        <Row>
                                            {
                                                this.props.companyServices[this.props.outletCode].services.includes("KPPE.HD") ?
                                                    <Col md="4">
                                                        <span className="h5 font-weight-bold mb-0 text-nowrap">
                                                            <center>
                                                                <span className="text-red">
                                                                    No Hairnet
                                                                </span>
                                                                <br />
                                                                {this.state.deviation_hairnet > 0 ? `${this.state.deviation_hairnet.toFixed(0)}` : '-'}
                                                            </center>
                                                        </span>
                                                    </Col>
                                                    :
                                                    null
                                            }
                                            {
                                                this.props.companyServices[this.props.outletCode].services.includes("KPPE.FMD") ?
                                                    <Col md="4">
                                                        <span className="h5 font-weight-bold mb-0 text-nowrap">
                                                            <center>
                                                                <span className="text-info">
                                                                    No Masks
                                                                </span>
                                                                <br />
                                                                {this.state.deviation_mask > 0 ? `${this.state.deviation_mask.toFixed(0)}` : '-'}
                                                            </center>
                                                        </span>
                                                    </Col>
                                                    :
                                                    null
                                            }
                                            {
                                                this.props.companyServices[this.props.outletCode].services.includes("KPPE.GD") ?
                                                    <Col md="4">
                                                        <span className="h5 font-weight-bold mb-0 text-nowrap">
                                                            <center>
                                                                <span className="text-orange">
                                                                    No Gloves
                                                                </span>
                                                                <br />
                                                                {this.state.deviation_glove > 0 ? `${this.state.deviation_glove.toFixed(0)}` : '-'}
                                                            </center>
                                                        </span>
                                                    </Col>
                                                    :
                                                    null
                                            }
                                        </Row>
                                        :
                                        null
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

//export default Details;

export default connect(
    mapStateToProps,
)(Details);