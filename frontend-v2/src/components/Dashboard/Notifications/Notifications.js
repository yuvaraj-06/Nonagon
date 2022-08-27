import React, { Component } from "react";
// import { Card, CardBody, Row, Table, CardTitle, Col, Button, Modal } from "reactstrap";
import qs from "qs";
import axios from "axios";
import handleDateRange from 'utilFunctions/handleDateRange';
import { notificationURL } from "../../../ApiURL";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
};

class NotificationsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleModal: false,
            noOfNotifications: 0,
            outlet: this.props.outlet,
            time: this.props.time,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            daterange: "day",
            notifications: [],
            name: 'SandM'
            // name: jwt_decode(localStorage.getItem('act').name)
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        axios.get(
            notificationURL +
            `notification/not_updated/N003-LTP003/week`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                this._ismounted && this.setState({
                    noOfNotifications: res.data.length,
                    notifications: res.data,
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
                // time: nextProps.time,
            });
            this.fetchData(nextProps);
        }
    }

    toggleModal = (state) => {
        this._ismounted && this.setState({
            [state]: !this.state[state],
        });

    };

    updateNotification = async (outlet, timestamp, action, name) => {
        var data = qs.stringify({
            'outlet_code': outlet,
            'timestamp': timestamp,
            "action": action,
            "operator": name
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
                    this.fetchData(this.state);
                }
            })
            .catch(console.log);
    };

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (<div></div>);
        // return (
        //     <Card className="card-stats">
        //         <CardBody>
        //             <Row>
        //                 <div className="col">
        //                     <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
        //                         Unattended Notifications
        //                     </CardTitle>
        //                     <div className="mt-3 mb-2">
        //                         <Row>
        //                             <Col md="12">
        //                                 <span className="h1 font-weight-bold mb-0pl-3">
        //                                     <span className="text-info">
        //                                         <i className="fas fa-flag" />
        //                                     </span>{" "}
        //                                     {this.state.noOfNotifications}
        //                                 </span>
        //                             </Col>
        //                         </Row>
        //                     </div>
        //                 </div>
        //                 <Col className="col-auto">
        //                     <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
        //                         <i className="fas fa-bell" />
        //                     </div>
        //                 </Col>
        //             </Row>
        //             <div className="mt-2 mb-0 text-sm">
        //                 <div className="mt-1">
        //                     <Button
        //                         color="secondary"
        //                         outline
        //                         type="button"
        //                         size="sm"
        //                         onClick={() => this.toggleModal("exampleModal")}
        //                     >
        //                         <span className="text-info">
        //                             View All
        //         </span>{" "}
        //                     </Button>
        //                 </div>
        //                 <Modal
        //                     className="modal-dialog-centered"
        //                     isOpen={this.state.exampleModal}
        //                     toggle={() => this.toggleModal("exampleModal")}
        //                     size="xl"
        //                 >
        //                     <div className="modal-header">
        //                         <span>
        //                             <h4 className="modal-title" id="exampleModalLabel">
        //                                 Unattended Notifications
        //           </h4>
        //                             <br />
        //                             <h4 className="h4 text-muted">({this.state.daterange})</h4>
        //                         </span>
        //                         <button
        //                             aria-label="Close"
        //                             className="close"
        //                             data-dismiss="modal"
        //                             type="button"
        //                             onClick={() => this.toggleModal("exampleModal")}
        //                         >
        //                             <span aria-hidden={true}>×</span>
        //                         </button>
        //                     </div>
        //                     <div className="modal-body">
        //                         <Row>
        //                             <Col>
        //                                 <Card>
        //                                     <CardBody>
        //                                         <div className='text-left'>
        //                                             <Table responsive>
        //                                                 <thead>
        //                                                     <tr>
        //                                                         <th>S.No.</th>
        //                                                         <th >Title</th>
        //                                                         <th >Suspicion</th>
        //                                                         <th >Detail</th>
        //                                                         <th >Detected At</th>
        //                                                         <th>Actions/Details</th>
        //                                                     </tr>
        //                                                 </thead>
        //                                                 <tbody>
        //                                                     {
        //                                                         this.state.notifications.length !== 0 ?
        //                                                             this.state.notifications.map((item, key) => {
        //                                                                 return (
        //                                                                     <tr key={key}>
        //                                                                         <th scope='row'>{this.state.notifications.indexOf(item) + 1}</th>
        //                                                                         <td >{item.title}</td>
        //                                                                         <td>{item.suspicion_level}</td>
        //                                                                         <td>{item.content}</td>
        //                                                                         <td>{new Date(item.timestamp).toLocaleTimeString('en-US', {
        //                                                                             hour: "2-digit",
        //                                                                             minute: "2-digit",
        //                                                                         })}
        //                                                                         </td>
        //                                                                         <td>
        //                                                                             {
        //                                                                                 item.action !== '' && item.operator !== '' ?
        //                                                                                     <div>
        //                                                                                         {item.action} by {item.operator} at {new Date(item.updated_at).toLocaleTimeString('en-US', {
        //                                                                                             hour: "2-digit",
        //                                                                                             minute: "2-digit",
        //                                                                                         })}&nbsp;&nbsp;&nbsp;&nbsp;
        //                                                                         </div>
        //                                                                                     :
        //                                                                                     <div>
        //                                                                                         {/* No action taken */}
        //                                                                                         {/* <Button size='sm'
        //                                                                                             onClick={(e) => {
        //                                                                                                 e.preventDefault();
        //                                                                                                 this.setState({
        //                                                                                                     modalData: item
        //                                                                                                 })
        //                                                                                                 this.toggleModal("exampleModal")
        //                                                                                             }}
        //                                                                                         ><i className='fas fa-eye text-info'></i></Button> */}
        //                                                                                         <Button color='info' size='sm' onClick={(e) => {
        //                                                                                             e.preventDefault();
        //                                                                                             this.updateNotification(item.outlet_code, item.timestamp, 'Accepted', this.state.name)
        //                                                                                         }}
        //                                                                                         ><i className='fas fa-check-circle'>&nbsp;Accept</i></Button>
        //                                                                                         <Button color="danger" size='sm'
        //                                                                                             onClick={(e) => {
        //                                                                                                 e.preventDefault();
        //                                                                                                 this.updateNotification(item.outlet_code, item.timestamp, 'Rejected', this.state.name)
        //                                                                                             }}
        //                                                                                         ><i className='fas fa-times-circle'>&nbsp;Reject</i></Button>
        //                                                                                         <Button size='sm'
        //                                                                                             onClick={(e) => {
        //                                                                                                 e.preventDefault();
        //                                                                                                 this.updateNotification(item.outlet_code, item.timestamp, 'Forwarded', this.state.name)
        //                                                                                             }}
        //                                                                                         >Forward</Button>
        //                                                                         &nbsp;&nbsp;&nbsp;&nbsp;
        //                                                     </div>
        //                                                                             }
        //                                                                         </td>
        //                                                                     </tr>
        //                                                                 )
        //                                                             })
        //                                                             :
        //                                                             <tr>
        //                                                                 <th></th>
        //                                                                 <td></td>
        //                                                                 <td></td>
        //                                                                 <td><center>You don't have any notifications.</center></td>
        //                                                             </tr>
        //                                                     }
        //                                                 </tbody>
        //                                             </Table>
        //                                         </div >
        //                                     </CardBody>
        //                                 </Card>
        //                             </Col>
        //                         </Row>
        //                     </div>
        //                 </Modal>
        //             </div>
        //         </CardBody>
        //     </Card>
        // );
    }
}

//export default NotificationsCard;

export default connect(
    mapStateToProps,
)(NotificationsCard);

// "timestamp":"2021-03-11T14:17:25.379000"
// timestamp: "2021-03-11T15:39:42.296385"