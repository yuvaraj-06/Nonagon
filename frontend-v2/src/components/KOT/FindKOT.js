import React from "react"
import {
    Card,
    CardBody,
    Row,
    Col,
    Button,
    Input
} from "reactstrap"
import axios from "axios"
import { nodeBaseURL } from "ApiURL"

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
}

class FindKOT extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderNo: '',
            outlet: props.act.outlet,
            timestamp: '',
            searchOrderNo: '',
            viewOrder: false,
            viewErr: false,
            errMsg: '',
            image: ""
        }
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `kot/find/${nextProps.outlet}/${nextProps.searchOrderNo}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then(res => {
                if (res.data.length === 0) {
                    this._ismounted && this.setState({
                        viewOrder: false,
                        viewErr: true,
                        errMsg: `Order not punched for order no ${this.state.searchOrderNo}`
                    })
                }
                else if (res.data !== []) {
                    this._ismounted && this.setState({
                        orderNo: res.data[0].order_number,
                        timestamp: res.data[0].ts,
                        image: res.data[0].kot_screenshot,
                        viewOrder: true,
                        viewErr: false,
                    })
                }
            })
            .catch(err => {
                this._ismounted && this.setState({
                    viewOrder: false,
                    viewErr: true,
                    errMsg: "Something went wrong, please contact us at support@nonagon.xyz"
                })
            })
    }

    handleInputChange = (e) => {
        this._ismounted && this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <Card>
                    <CardBody>
                        <Row>
                            <Col >
                                <Input
                                    type="number"
                                    name="searchOrderNo"
                                    value={this.state.searchOrderNo}
                                    placeholder="Enter order number in search box"
                                    onChange={this.handleInputChange}
                                />
                            </Col>
                            <Col className="text-right">
                                <Button
                                    color="info"
                                    type="button"
                                    name="submit"
                                    id="submit"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.fetchData(this.state);
                                    }}
                                >
                                    Search kitchen order
                                </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                {
                    this.state.viewOrder ?
                        < Card className="card-profile shadow">
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <Col xs="6">
                                        <div>
                                            <div>
                                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                                    <img
                                                        alt={this.state.orderNo}
                                                        src={
                                                            // `data:image/png;base64,$
                                                            // {
                                                            this.state.image
                                                            // }`
                                                        }
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                    </Col>
                                    {/* <Col>{this.state.errMsg}</Col> */}
                                    <Col xs="6">
                                        <div>
                                            <div>
                                                <span className="heading">Order Details</span>
                                                <br /><br />
                                                <span className="heading">Order Number:  </span>
                                                <span className="">{this.state.orderNo}</span>
                                                <br />
                                                <span className="heading">Order Punched Time:  </span>
                                                <span className="description">{new Date(this.state.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        :
                        ''
                }
                {
                    this.state.viewErr ?
                        <Card>
                            <CardBody>
                                <h3>{this.state.errMsg}</h3>
                            </CardBody>
                        </Card>
                        :
                        ''
                }
            </div>
        )
    }
}

//export default FindKOT

export default connect(
    mapStateToProps,
)(FindKOT);