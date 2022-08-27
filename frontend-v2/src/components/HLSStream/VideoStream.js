import React from 'react';
import {
    Col,
    Row,
    Card,
    CardBody,
    CardHeader,
    // Button
} from 'reactstrap'

import HLSFeed from 'components/HLSStream/HLSFeed';
import { connect } from 'react-redux';
import { getStreamButtonList } from 'utilFunctions/getStreamButtonList';

const mapStateToProps = (state) => {
    return {
        companyServices: state.services.companyServices,
        outletCode: state.outletCode.outletCode
    };
}

class VideoStream extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sec20: '',
            showStream: this.props.showStream,
            selectedFile: '',
            loaded: 0,
            showInference: false,
            cam_no: 'live',
            cam_name: "All Cams",
            cams: getStreamButtonList(props.companyServices[props.outletCode] ? props.companyServices[props.outletCode].number_cams : 0)
        }
        this._ismounted = true;
    }

    updateOutletCode = (outlet_code) => {
        this._ismounted && this.setState({ inferenceOutlet: outlet_code })
    }

    updateCamNo = (cam_no, cam_name) => {
        this._ismounted && this.setState({ cam_no: cam_no, cam_name: cam_name })
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidMount() {
        setTimeout(() => {
            this._ismounted && this.setState({
                sec20: 'Your connection is slow, do not worry your stream is currently successfully paired to our AI'
            })
        }, 30000)
        this._ismounted && this.toggleNotifications(true)
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                showStream: nextProps.showStream,
                cams: getStreamButtonList(nextProps.companyServices[nextProps.outletCode] ?
                    nextProps.companyServices[nextProps.outletCode].number_cams :
                    0)
            })
        }
    }

    toggleNotifications = (value) => {
        this._ismounted && this.setState({ showNotifications: value })
    }
    render() {
        return (
            <>
                <div>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col className='cam-title'>
                                    <span className='h3'>Inference
                                        for {this.state.cam_name}
                                    </span>
                                </Col>
                                <Row className="mr-2">
                                    <Col className='cam-btn-row'>
                                        {/* <Button className="cam-btn" size='sm' color='info' onClick={(e) => {
                                            e.preventDefault()
                                            this.updateCamNo('live', "All Cams")
                                        }}>All Cams</Button> */}
                                        {/* {
                                            this.state.cams.map((item, key) => {
                                                return (<Button className="cam-btn" size='sm' color='info' key={key} onClick={(e) => {
                                                    e.preventDefault()
                                                    this.updateCamNo(item.value, item.text)
                                                }}>{item.text}</Button>)
                                            })
                                        } */}
                                    </Col>
                                </Row>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <span className='h3 m-auto'>{this.state.sec20}</span>
                            </Row>
                            <div>
                                <HLSFeed cam_no={this.state.cam_no} />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </>
        )
    }
}

export default connect(
    mapStateToProps
)(VideoStream)