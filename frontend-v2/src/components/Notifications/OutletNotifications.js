import React from 'react';
import {
    Col,
    Row,
    Card,
    CardBody,
    CardHeader,
    Button,
    Table,
    Modal,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Media
} from 'reactstrap'
import { notificationURL } from '../../ApiURL'
import axios from 'axios';
import qs from 'qs'
// import { CSVLink } from "react-csv";
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { getConvertedTime, hour12Format } from 'utilFunctions/getConvertedTime';
import { getUniqueValuesFromArray } from 'utilFunctions/getUniqueValuesFromArray';
import { getTrimmedString } from 'utilFunctions/getTrimmedString';
import 'react-toastify/dist/ReactToastify.css';
import { NotifyWrapper } from 'components/Alerts/Notify';
import { isURL } from 'utilFunctions/isURL';
import { getReplacedString } from 'utilFunctions/getReplacedString';

const mapStateToProps = (state) => {
    let act = jwt_decode(state.act.act)
    return {
        outletCode: state.outletCode.outletCode,
        name: act.name,
        company: act.company,
        time: state.time.time,
        outletList: act.outlets,
        companyServices: state.services.companyServices,
        outletCameraDetails: state.outletCode.outletCameraDetails,
        outletTimezone: state.outletCode.outletTimezone,
    };
}

const mlModelSuccessNotification = () => {
    NotifyWrapper.success("Thank you for Confirming - Your answers improve our ML models predictions for your outlet");
}

class OutletNotifications extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            name: props.name,
            outlet: props.outletCode,
            company: props.company,
            time: props.time,
            showNotifications: this.props.showNotifications,
            modalData: { image_base64: '', content: '', camera_location: '' },
            errMsg: "Loading...",
            loadingMsg: 'Loading...',
            camera: 'cam_full',
            outletCameraDetails: props.outletCameraDetails,
            filteredNotifications: [],
            filterByTitle: 'No Filter',
            listOfTitlesForFilter: [],
            timeZone: props.companyServices[props.outletCode] ? props.companyServices[props.outletCode].timezone : null
        }
        this._ismounted = true;
    }

    toggleModal = (state) => {
        this._ismounted && this.setState({
            [state]: !this.state[state],
        });
    };

    fetchData = async (outlet, nextProps) => {
        axios.get(
            notificationURL +
            `notification/list/${outlet}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                this._ismounted && this.setState({
                    filteredNotifications: this.filterNotificationsByCamera("none", res.data, false),
                    listOfTitlesForFilter: getUniqueValuesFromArray(res.data.map(item => item.title)),
                    notifications: res.data,
                    errMsg: "",
                    loadingMsg: res.data.length === 0 ? 'You don\'t have any notifications.' : ''
                });
            })
            .catch(err => {
                this._ismounted && this.setState({
                    errMsg: 'We are currently facing some issue. Please raise an issue in support tab.',
                    loadingMsg: 'We are currently facing some issue. Please raise an issue in support tab.'
                });
            });
    }

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
                'accept': 'application/json'
            },
            data: data
        };
        await axios(config)
            .then(res => {
                if (res.status === 200) {
                    this.fetchData(this.state.outlet, this.state)
                }
            })
            .catch(err => {

            });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    filterNotificationsByCamera = (camera, allNotificationsFromState, setState) => {
        var filteredNotifications = []
        if (camera === 'none' || camera === 'cam_full') {
            filteredNotifications = allNotificationsFromState
        } else {
            filteredNotifications = allNotificationsFromState.filter(item => item.camera_location === camera)
        }
        if (setState) {
            this._ismounted && this.setState({
                camera,
                filteredNotifications,
                loadingMsg: `You have ${filteredNotifications.length} notifications for this camera.`
            })
        } else {
            return filteredNotifications
        }
    }

    filterNotificationsByTitle = (notifications, filterToUse) => {
        if (filterToUse === "No Filter") {
            return notifications;
        } else {
            return notifications.filter(
                (item) => item.title === filterToUse
            );
        }
    };

    componentDidMount() {
        this._ismounted && this.fetchData(this.state.outlet, this.state)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                showNotifications: nextProps.showNotifications,
                companyServices: nextProps.companyServices,
                timeZone: nextProps.companyServices[nextProps.outletCode] ? nextProps.companyServices[nextProps.outletCode].timezone : null,
                time: nextProps.time,
                outlet: nextProps.outletCode,
                errMsg: 'Loading...',
                loadingMsg: 'Loading...'
            })
            this._ismounted && this.fetchData(nextProps.outletCode, nextProps)
        }
        // NotifyWrapper.success("By Accepting / Rejecting a notification, you help us improve our results at your store")
    }

    scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }

    scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    render() {
        return (
            <>
                {
                    this.state.showNotifications ?
                        <div>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        {this.state.errMsg === '' ?
                                            <Col className='text-left h3'>You have total {this.state.notifications.length} notifications for {this.props.companyServices[this.props.outletCode]
                                                ? this.props.companyServices[this.props.outletCode].outlet_location
                                                : 'Loading...'} Outlet</Col>
                                            :
                                            <Col className='text-left h3'>{this.state.errMsg}</Col>
                                        }
                                        <Col className='text-right'>
                                            {/* <CSVLink
                                                style={{ textDecoration: "none" }}
                                                data={this.state.notifications}
                                                ref={(r) => (this.surveyLink = r)}
                                                filename={
                                                    'Notification Logs' + new Date().toLocaleDateString("en-GB") +
                                                    " " +
                                                    new Date().toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }) +
                                                    ".csv"
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            > */}
                                            {/* <Button size='sm' color='primary'>Download</Button> */}
                                            {/* </CSVLink> */}
                                            {/*  */}

                                            {/* filter by title */}
                                            <UncontrolledDropdown nav>
                                                <DropdownToggle className="nav-link pr-0" color="" tag="a">
                                                    <Media className="align-items-center">
                                                        <Button size='sm'>
                                                            {/* <span className="avatar avatar-sm rounded-circle bg-white text-primary"> */}
                                                            <i className="fas fa-filter text-primary"></i>&nbsp;&nbsp;
                                                            {/* </span> */}
                                                            {/* <Media className="ml-2 d-none d-lg-block"> */}
                                                            {/* <span className="mb-0 text-sm font-weight-bold"> */}
                                                            {this.state.filterByTitle}
                                                            {/* </span> */}
                                                            {/* </Media> */}
                                                        </Button>
                                                    </Media>
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    {
                                                        ['No Filter'].concat(this.state.listOfTitlesForFilter).map((item, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <DropdownItem
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            this._ismounted && this.setState({
                                                                                filterByTitle: item,
                                                                            })
                                                                        }}
                                                                    >
                                                                        <span>{item}</span>
                                                                    </DropdownItem>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                            &nbsp;&nbsp;&nbsp;

                                            {/* filter by camera location */}
                                            <UncontrolledDropdown nav>
                                                <DropdownToggle className="nav-link pr-0" color="" tag="a">
                                                    <Media className="align-items-center">
                                                        <Button size='sm'>
                                                            {/* <span className="avatar avatar-sm rounded-circle bg-white text-primary"> */}
                                                            <i className="fas fa-video text-primary"></i>&nbsp;&nbsp;
                                                            {/* </span> */}
                                                            {/* <Media className="ml-2 d-none d-lg-block"> */}
                                                            {/* <span className="mb-0 text-sm font-weight-bold"> */}
                                                            {this.props.outletCameraDetails[this.state.camera]}
                                                            {/* </span> */}
                                                            {/* </Media> */}
                                                        </Button>
                                                    </Media>
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    {
                                                        Object.keys(this.props.outletCameraDetails).map((item, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <DropdownItem
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            this.filterNotificationsByCamera(item, this.state.notifications, true)
                                                                        }}
                                                                    >
                                                                        <span>{this.props.outletCameraDetails[item]}</span>
                                                                    </DropdownItem>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                            &nbsp;&nbsp;&nbsp;
                                            <Button size='sm' color='primary' onClick={this.scrollToBottom}>Go to Bottom</Button>
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col className='text-right'>
                                        </Col>
                                    </Row> */}
                                </CardHeader>
                                <CardBody>
                                    <div className='text-left'>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th >Title</th>
                                                    {
                                                        this.props.company === 'SANDM' ?
                                                            <th >Suspicion</th>
                                                            : null
                                                    }
                                                    <th >Detail</th>
                                                    <th>Camera</th>
                                                    <th >Detected At</th>
                                                    <th></th>
                                                    <th>Actions/Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.filteredNotifications.length !== 0 ?
                                                        this.filterNotificationsByTitle(this.state.filteredNotifications, this.state.filterByTitle).map((item, key) => {
                                                            return (
                                                                <tr key={key}>
                                                                    <th scope='row'>{this.state.filteredNotifications.indexOf(item) + 1}</th>
                                                                    <td >{item.title}</td>
                                                                    {
                                                                        this.props.company === 'SANDM' ?
                                                                            <td>{item.suspicion_level}</td>
                                                                            : null
                                                                    }
                                                                    <td>{getTrimmedString(item.content, 10)}</td>
                                                                    <td>{this.props.outletCameraDetails[item.camera_location]}</td>
                                                                    <td>{getConvertedTime(item.timestamp, this.props.outletTimezone, hour12Format)}</td>
                                                                    <td>
                                                                        <Button size='sm'
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.setState({
                                                                                    modalData: item
                                                                                })
                                                                                this.toggleModal("exampleModal")
                                                                            }}
                                                                        ><i className='fas fa-eye text-info'></i></Button></td>
                                                                    <td>
                                                                        {
                                                                            item.action !== '' && item.operator !== '' ?
                                                                                <div>
                                                                                    {item.action} by {item.operator} at {getConvertedTime(item.timestamp, this.props.outletTimezone, hour12Format)}&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    {/* No action taken */}
                                                                                    {/* <Button size='sm'
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            this.setState({
                                                                                                modalData: item
                                                                                            })
                                                                                            this.toggleModal("exampleModal")
                                                                                        }}
                                                                                    ><i className='fas fa-eye text-info'></i></Button> */}
                                                                                    <Button color='info' size='sm'
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            mlModelSuccessNotification()
                                                                                            this.updateNotification(item.outlet_code, item.timestamp, 'Accepted', this.state.name, item)
                                                                                        }}
                                                                                    ><i className='fas fa-check-circle'>&nbsp;Accept</i></Button>
                                                                                    <Button color="danger" size='sm'
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            mlModelSuccessNotification()
                                                                                            this.updateNotification(item.outlet_code, item.timestamp, 'Rejected', this.state.name, item)
                                                                                        }}
                                                                                    ><i className='fas fa-times-circle'>&nbsp;Reject</i></Button>
                                                                                    {/* <Button size='sm'
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            this.updateNotification(item.outlet_code, item.timestamp, 'Forwarded', this.state.name, item)
                                                                                        }}
                                                                                    >Forward</Button> */}
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
                                                            <td><center>{this.state.loadingMsg}</center></td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </div >
                                </CardBody>
                            </Card>
                        </div>
                        :
                        ''
                }
                <Row>
                    <Col className="text-right" lg="12" xs="12">
                        <Button size='sm' color='primary' onClick={this.scrollToTop}>Go to Top</Button>
                    </Col>
                    <br /><br />
                </Row>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.exampleModal}
                    toggle={() => this.toggleModal("exampleModal")}
                    size="lg"
                >
                    <div className="modal-header">
                        <span>
                            <h4 className="modal-title" id="exampleModalLabel">
                                Notification Data
                            </h4>
                            {/* <h4 className="surtitle">({this.state.daterange})</h4> */}
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
                                                    {
                                                        this.state.company === 'SANDM' ?
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
                                                    {this.state.company === 'SANDM' ?
                                                        <td>{this.state.modalData.suspicion_level}</td>
                                                        :
                                                        null}
                                                    <td>{getReplacedString(this.state.modalData.content, this.state.modalData.camera_location, this.props.outletCameraDetails[this.state.modalData.camera_location])}</td>
                                                    <td>{this.props.outletCameraDetails[this.state.modalData.camera_location]}</td>
                                                    <td>{getConvertedTime(this.state.modalData.timestamp, this.props.outletTimezone, hour12Format)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <br></br>
                                        {
                                            this.state.modalData.action === '' && this.state.modalData.operator === '' ?
                                                <Row>
                                                    <Col className='text-center'>
                                                        <Button color='info' size='sm' onClick={(e) => {
                                                            e.preventDefault();
                                                            mlModelSuccessNotification()
                                                            this.updateNotification(this.state.modalData.outlet_code, this.state.modalData.timestamp, 'Accepted', this.state.name, this.state.modalData)
                                                            this.toggleModal('exampleModal')
                                                        }}
                                                        ><i className='fas fa-check-circle'>&nbsp;Accept</i></Button>
                                                        <Button color="danger" size='sm'
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                mlModelSuccessNotification()
                                                                this.updateNotification(this.state.modalData.outlet_code, this.state.modalData.timestamp, 'Rejected', this.state.name, this.state.modalData)
                                                                this.toggleModal('exampleModal')
                                                            }}
                                                        ><i className='fas fa-times-circle'>&nbsp;Reject</i></Button>
                                                    </Col>
                                                </Row>
                                                :
                                                ''
                                        }
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

                                            //     this.state.modalData.image_base64.includes('.mp4') ?
                                            // <Row>
                                            //     <video width='100%' height='100%' controls autoPlay controlsList="nodownload" preload="auto">
                                            //         <source src={this.state.modalData.image_base64} type="video/mp4" />
                                            //         Your browser does not support the video tag.
                                            //     </video>
                                            // </Row>
                                            // :
                                            // < Row >
                                            //     <Col className='text-center mt-4'>
                                            //         <img
                                            //             alt={this.state.modalData.image_base64}
                                            //             src={`data:image/png;base64,${this.state.modalData.image_base64}`}
                                            //         />
                                            //     </Col>
                                            // </Row>
                                        }
                                        {/* commented because video is not changing without reopening modal */}
                                        {/* <Row className='mt-4'>
                                            <Col className='text-left'>
                                                {this.state.notifications.indexOf(this.state.modalData) !== 0 ?
                                                    <Button onClick={this.prevNotif}><i class="fas fa-arrow-left"></i></Button>
                                                    :
                                                    null
                                                }
                                            </Col>
                                            <Col className='text-center'>
                                                {this.state.notifications.indexOf(this.state.modalData) + 1}
                                            </Col>
                                            <Col className='text-right'>
                                                {this.state.notifications.indexOf(this.state.modalData) !== this.state.notifications.length - 1 ?
                                                    <Button onClick={this.nextNotif}><i class="fas fa-arrow-right"></i></Button>
                                                    :
                                                    null
                                                }
                                            </Col>
                                        </Row> */}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </>
        )
    }
}

export default connect(
    mapStateToProps,
)(OutletNotifications);