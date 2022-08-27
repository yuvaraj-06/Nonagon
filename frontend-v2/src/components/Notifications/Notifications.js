import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row
} from 'reactstrap';
import { notificationURL } from '../../ApiURL';
import axios from 'axios';
import qs from 'qs';
import Button from 'reactstrap/lib/Button';
import PaginationTable from "components/Notifications/PaginationTable";
import moment from 'moment-timezone';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
    let act = jwt_decode(state.act.act);
    return {
        outlet: state.outletCode.outletCode,
        name: act.name,
        company: act.company,
        time: state.time.time,
    };
};

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            name: props.name,
            company: props.company,
            time: props.time,
            outlet: props.outlet,
            showNotifications: true,
            loadingMsg: 'Loading...'
        };
        this._ismounted = true;
    }

    fetchData = (nextProps, time) => {
        axios.get(
            notificationURL +
            `notification/list/${nextProps.outlet}/${time}`,
            {
                headers: {

                }
            }
        )
            .then((res) => {
                var x = res.data.map((item, key) => {
                    var action = item.action !== '' && item.operator !== '' ?
                        `${item.action}`
                        //  by ${item.operator} at ${moment(item.timestamp).format('DD-MM-YYYY / HH:mm:ss')}`
                        :
                        "No action taken";
                    return (
                        {
                            sno: res.data.indexOf(item) + 1,
                            action: action,
                            title: item.title,
                            suspicion: item.suspicion_level,
                            detail: item.content,
                            cam: item.camera_location,
                            detected: moment(item.timestamp).format('DD-MM-YYYY / HH:mm:ss')
                        }
                    );
                });
                this._ismounted && this.setState({
                    notifications: x,
                    loadingMsg: ''
                });
            })
            .catch(err => {

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
            .catch(err => {

            });
    };

    componentDidMount() {
        this._ismounted && this.fetchData(this.state, this.state.time);
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.time !== nextProps.time) {
            this._ismounted && this.setState({
                time: nextProps.time,
                loadingMsg: 'Loading...'
            });
            this._ismounted && this.fetchData(this.state, nextProps.time);
        }
    }

    render() {
        return (
            <>
                {
                    this.state.showNotifications ?
                        <div>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col className='text-left h3'>Notification Logs ({this.state.notifications.length})</Col>
                                        <Col className='text-right'>
                                            <Button onClick={() => {
                                                this._ismounted && this.setState({
                                                    loadingMsg: 'Loading...'
                                                });
                                                this.fetchData(this.state, this.state.time);
                                            }} size='sm' className='bg-info'>
                                                <i className='fas fa-sync-alt text-secondary'></i><span className='h5 text-secondary'>Refresh</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    {
                                        this.state.loadingMsg === '' ?
                                            <PaginationTable data={this.state.notifications} />
                                            :
                                            <span className='text-center h3'>{this.state.loadingMsg}</span>
                                    }

                                </CardBody>
                            </Card>
                        </div>
                        :
                        ''
                }
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(Notifications);