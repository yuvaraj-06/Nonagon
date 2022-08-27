import React from 'react';
import {
    Col,
    Row,
    Card,
    CardBody,
    CardHeader,
    Button,
    Table,
    Modal
} from 'reactstrap'
import { notificationURL, pusherKey } from '../../ApiURL'
import axios from 'axios';
import qs from 'qs'
import jwt_decode from 'jwt-decode';
import Pusher from 'pusher-js';
import { isURL } from 'utilFunctions/isURL';
import { getTrimmedString } from 'utilFunctions/getTrimmedString';
// import notification from 'assets/audio/notification.mp3'

import { connect } from 'react-redux'
import { getConvertedTime } from 'utilFunctions/getConvertedTime';
import { getLiveNotificationsOutletArray } from 'utilFunctions/getLiveNotificationOutletsArray';
import { hour12Format } from 'utilFunctions/getConvertedTime';

const mapStateToProps = (state) => {
    let act = jwt_decode(state.act.act)
    return {
        outlet: state.outletCode.outletCode,
        outletCode: state.outletCode.outletCode,
        act: act,
        companyServices: state.services.companyServices,
        outletTimezone: state.outletCode.outletTimezone
    };
}


let isPusherSubscribed = false;

const subscribeToPusher = (
    compCode,
    userOutletsAccessArray,
    companyServices,
    role,
    newNotification
) => {
    let outlets = getLiveNotificationsOutletArray(userOutletsAccessArray, companyServices)
    if (!isPusherSubscribed) {
        const pusher = new Pusher(pusherKey, {
            cluster: 'ap2'
        });
        const channel = pusher.subscribe(compCode);
        if (role === 'manager' || role === 'admin') {
            // for all clients
            // outlets = outlets.map(item => `${item}_manager`)
            // for sandm
            outlets = [compCode].map(item => `${item}_manager`)
            // ultratech
            if (compCode === 'ULTEC') {
                outlets = getLiveNotificationsOutletArray(userOutletsAccessArray, companyServices)
            }
        }
        outlets.map((item) => {
            return channel.bind(item, (data) => {
                newNotification(data)
            });
        })
        isPusherSubscribed = true
    }

}

class NotificationsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: this.props.notifications || [],
            name: props.act.name,
            modalData: { image_base64: '', camera_location: '' },
            role: props.act.role,
            compCode: props.act.company,
            companyServices: props.companyServices,
            timeZone: props.companyServices[props.outletCode]
                ? props.companyServices[props.outletCode].timezone
                : null,
        }
        this._ismounted = true;
    }

    toggleModal = (state) => {
        this._ismounted && this.setState({
            [state]: !this.state[state],
        });
    };

    updateNotification = async (outlet, timestamp, action, name, item) => {
        var data = qs.stringify({
            'outlet_code': outlet,
            'timestamp': timestamp,
            "action": action,
            "operator": name,
            "data": JSON.stringify(item)
        });
        var config = {
            method: 'post',
            url: `${notificationURL}notification/update`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            mode: 'cors',
            data: data
        };
        await axios(config)
            .then(res => {
                if (res.status === 200) {
                    this.removeNotificationFromState(this.state.notifications, item)
                }
            })
            .catch(err => {

            });
    }

    newNotification = async (data) => {
        this._ismounted &&
            // new Audio(notification).play() &&
            this.setState({
                notifications: [data, ...this.state.notifications]
            })
        //autoignoring notification 3 mins after arrival
        var name = this.state.name;
        var updateNotification = this.updateNotification;
        var checkIfNotificationExistsInState = this.checkIfNotificationExistsInState;
        this.state.role === 'operator' && this._ismounted && setTimeout(
            function () {
                if (checkIfNotificationExistsInState(data)) {
                    updateNotification(data.outlet_code, data.timestamp, "Autoforwarded", name, data)
                }
            },
            180000)
    }

    checkIfNotificationExistsInState = (value) => {
        var index = this.state.notifications.indexOf(value);
        if (index > -1) {
            return true
        }
        return false
    }

    fetchData = async (time, outlet) => {
        axios.get(
            notificationURL +
            `notification/fetch_notif/${outlet}/${time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                this._ismounted && this.setState({
                    modalData: {
                        ...this.state.modalData,
                        image_base64: res.data.image_base64
                    }
                });
                this.toggleModal("exampleModal")
            })
            .catch(err => {
                alert('Error fetching modal image')
            });
    }

    removeNotificationFromState = (arr, value) => {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        this.setState({
            pushernotifications: arr
        })
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidMount() {
        this._ismounted && this.toggleNotifications(true)
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                role: nextProps.act.role,
                companyServices: nextProps.companyServices,
                timeZone: nextProps.companyServices[nextProps.outletCode]
                    ? nextProps.companyServices[nextProps.outletCode].timezone
                    : null,
            })
            subscribeToPusher(
                nextProps.act.company,
                nextProps.act.outlets,
                nextProps.companyServices,
                nextProps.act.role,
                this.newNotification
            )
        }
    }

    toggleNotifications = (value) => {
        this._ismounted && this.setState({ showNotifications: value })
    }

    render() {
        return (
            <>
                {
                    this.state.notifications.length > 0 ?
                        <Card size='md'>
                            <CardHeader>
                                <Row>
                                    <Col className='text-left h3'>Live Alerts ({this.state.notifications.length})</Col>

                                </Row>
                                <Row>
                                    <Col className='text-left h5'>These alerts disappear on reload or after the threshold time period.</Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <div className='text-left'>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th >Title</th>
                                                {this.state.compCode === 'SANDM' ?
                                                    <th >Suspicion</th>
                                                    :
                                                    null}
                                                <th >Detail</th>
                                                <th>Camera</th>
                                                {/* {
                                            this.state.role !== 'operator' ?
                                                <th>Last Action</th>
                                                :
                                                ''
                                        }
                                        //only for sandm */}
                                                <th >Detected At</th>
                                                <th>Actions/Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.notifications.length !== 0 ?
                                                    this.state.notifications.map((item, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <th scope='row'>{this.state.notifications.indexOf(item) + 1}</th>
                                                                <td >{item.title}</td>
                                                                {this.state.compCode === 'SANDM' ?
                                                                    <td>{item.suspicion_level}</td>
                                                                    :
                                                                    null
                                                                }
                                                                <td>{getTrimmedString(item.content, 15)}</td>
                                                                <td>{item.camera_location.toString().toUpperCase()}</td>
                                                                {
                                                                    this.state.role !== 'operator' && this.state.compCode === 'SANDM' ?
                                                                        <td>{item.action}</td>
                                                                        :
                                                                        null
                                                                }
                                                                {/* //only for sandm */}

                                                                <td>{getConvertedTime(item.timestamp, this.props.outletTimezone, hour12Format)}</td>
                                                                <td>
                                                                    {
                                                                        item.action !== '' && item.operator !== '' ?
                                                                            <div>
                                                                                {item.action} by {item.operator} at {new Date(item.updated_at).toLocaleString('en-GB')}&nbsp;&nbsp;&nbsp;&nbsp;
                                                                            </div>
                                                                            :
                                                                            <div>
                                                                                {/* No action taken */}
                                                                                <Button size='sm'
                                                                                    onClick={async (e) => {
                                                                                        e.preventDefault();
                                                                                        this.setState({
                                                                                            modalData: item
                                                                                        })
                                                                                        this.toggleModal('exampleModal')
                                                                                        // await this.fetchData(item.timestamp, item.outlet_code)
                                                                                    }}
                                                                                ><i className='fas fa-eye text-info'></i></Button>
                                                                                <Button color='info' size='sm' onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    this.updateNotification(item.outlet_code, item.timestamp, 'Accepted', this.state.name, item)
                                                                                    this.removeNotificationFromState(this.state.notifications, item)
                                                                                }}
                                                                                ><i className='fas fa-check-circle'>&nbsp;Accept</i></Button>
                                                                                <Button color="danger" size='sm'
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        this.updateNotification(item.outlet_code, item.timestamp, 'Rejected', this.state.name, item)
                                                                                        this.removeNotificationFromState(this.state.notifications, item)
                                                                                    }}
                                                                                ><i className='fas fa-times-circle'>&nbsp;Reject</i></Button>
                                                                                {
                                                                                    this.state.role === 'operator'
                                                                                        && this.state.compCode === 'SANDM'
                                                                                        ?
                                                                                        <Button size='sm'
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault();
                                                                                                this.updateNotification(item.outlet_code, item.timestamp, 'Forwarded', this.state.name, item)
                                                                                                this.removeNotificationFromState(this.state.notifications, item)
                                                                                            }}
                                                                                        >Forward</Button>
                                                                                        :
                                                                                        <></>
                                                                                }
                                                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                                            </div>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <th></th>
                                                        <td></td>
                                                        <td></td>
                                                        <td><center>You don't have any new notifications.</center></td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </Table>
                                </div >
                                <Modal
                                    className="modal-dialog-centered"
                                    isOpen={this.state.exampleModal}
                                    toggle={() => this.toggleModal("exampleModal")}
                                    size="lg"
                                >
                                    <div className="modal-header">
                                        <span>
                                            <h4 className="modal-title" id="exampleModalLabel">
                                                Live Alert Data
                                            </h4>
                                            {/* <h4 className="h4 text-muted">({this.state.daterange})</h4> */}
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
                                        <Row>
                                            <Col>
                                                <Card>
                                                    <CardBody>
                                                        <Table responsive>
                                                            <thead>
                                                                <tr>
                                                                    <th >Title</th>
                                                                    {this.state.compCode === 'SANDM' ?
                                                                        <th >Suspicion</th>
                                                                        :
                                                                        null
                                                                    }
                                                                    <th >Detail</th>
                                                                    <th>Camera</th>
                                                                    <th >Detected At</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td >{this.state.modalData.title}</td>
                                                                    {
                                                                        this.state.compCode === 'SANDM' ?
                                                                            <td>{this.state.modalData.suspicion_level}</td>
                                                                            :
                                                                            null
                                                                    }
                                                                    <td>{this.state.modalData.content}</td>
                                                                    <td>{this.state.modalData.camera_location.toString().toUpperCase()}</td>
                                                                    <td>{getConvertedTime(this.state.modalData.timestamp, this.props.outletTimezone, hour12Format)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>

                                                        <br></br>
                                                        <Row>
                                                            <Col className='text-center'>
                                                                <Button color='info' size='sm' onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.updateNotification(this.state.modalData.outlet_code, this.state.modalData.timestamp, 'Accepted', this.state.name, this.state.modalData)
                                                                    this.removeNotificationFromState(this.state.notifications, this.state.modalData)
                                                                    this.toggleModal('exampleModal')
                                                                }}
                                                                ><i className='fas fa-check-circle'>&nbsp;Accept</i></Button>
                                                                <Button color="danger" size='sm'
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        this.updateNotification(this.state.modalData.outlet_code, this.state.modalData.timestamp, 'Rejected', this.state.name, this.state.modalData)
                                                                        this.removeNotificationFromState(this.state.notifications, this.state.modalData)
                                                                        this.toggleModal('exampleModal')
                                                                    }}
                                                                ><i className='fas fa-times-circle'>&nbsp;Reject</i></Button>
                                                                {
                                                                    this.state.role === 'operator' && this.state.compCode === 'SANDM' ?
                                                                        <Button size='sm'
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.updateNotification(this.state.modalData.outlet_code, this.state.modalData.timestamp, 'Forwarded', this.state.name, this.state.modalData)
                                                                                this.removeNotificationFromState(this.state.notifications, this.state.modalData)
                                                                                this.toggleModal('exampleModal')
                                                                            }}
                                                                        >Forward</Button>
                                                                        :
                                                                        ""
                                                                }
                                                            </Col>
                                                        </Row>
                                                        <br></br>
                                                        {
                                                            this.state.modalData.image_base64 ?
                                                                this.state.modalData.image_base64.includes('.mp4') ?
                                                                    <Row>
                                                                        <video width='100%' height='100%' controls autoPlay controlsList="nodownload" preload="auto">
                                                                            <source src={this.state.modalData.image_base64} type="video/mp4" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                    </Row>
                                                                    :
                                                                    < Row >
                                                                        <Col className='text-center mt-4'>
                                                                            <img
                                                                                alt={`${this.state.logsName} media`}
                                                                                src={`${!isURL(this.state.modalData.image_base64) ? "data:image/png;base64," : ""}${this.state.modalData.image_base64}`}
                                                                                width='100%'
                                                                                height='100%'
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                :
                                                                <Row>
                                                                    <span className='h4 m-auto'>Media Unavailable</span>
                                                                </Row>
                                                        }
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                </Modal>
                            </CardBody>
                        </Card>
                        :
                        null
                }
            </>
        )
    }
}

export default connect(
    mapStateToProps
)(NotificationsList)