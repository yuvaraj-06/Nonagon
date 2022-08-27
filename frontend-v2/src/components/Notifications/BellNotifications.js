import React from 'react';
import {
    Card,
    CardBody,
} from 'reactstrap';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { getConvertedTime, hour24Format } from 'utilFunctions/getConvertedTime';

const mapStateToProps = (state) => {
    let act = jwt_decode(state.act.act);
    return {
        outlet: state.outletCode.outletCode,
        companyServices: state.services.companyServices,
        name: act.name,
        company: act.company,
        time: state.time.time,
        outletCameraDetails: state.outletCode.outletCameraDetails,
        outletTimezone: state.outletCode.outletTimezone
    };
};

class BellNotifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: props.notifications,
            name: props.name,
            company: props.company,
            time: props.time,
            outlet: props.outlet,
            showNotifications: true,
            loadingMsg: 'Loading...',
            timeZone: props.companyServices[props.outlet] ? props.companyServices[props.outlet].timezone : null
        };
        this._ismounted = true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({
                companyServices: nextProps.companyServices,
                timeZone: nextProps.companyServices[nextProps.outlet] ? nextProps.companyServices[nextProps.outlet].timezone : null,
            })
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <>
                {
                    this.props.notifications ?
                        <div style={{ "userSelect": "none" }}>
                            {
                                this.props.notifications.length > 0 ?
                                    <div>
                                        <h2>Alerts ({this.props.notifications.length})</h2>
                                        {this.props.notifications.map((el, index) => {
                                            return (
                                                <div key={index}>
                                                    <Card className='notification-card' key={index}>
                                                        <CardBody>
                                                            <div className="sb">
                                                                <p className="camera-name">{this.props.outletCameraDetails[el.cam]}</p>
                                                                <p className="date-time">{getConvertedTime(el.detected, this.props.outletTimezone, hour24Format)}</p>
                                                            </div>
                                                            <div className="sb">
                                                                <p className="title">{el.title}</p>
                                                                <p className="text-right">{this.props.outletsNameObject[el.outlet_code]}</p>
                                                            </div>
                                                            <p className="details">{el.detail}</p>
                                                            <div className="sb">
                                                                <div className="vc">
                                                                    {el.suspicion !== '' ?
                                                                        <>
                                                                            <p className="sus">Suspicion Level:</p>
                                                                            {
                                                                                el.suspicion === 'High' ? <img src={require('../../assets/img/notifications/high.svg')} alt="" /> :
                                                                                    el.suspicion === 'Medium' ? <img src={require('../../assets/img/notifications/medium.svg')} alt="" /> :
                                                                                        el.suspicion === 'low' ? <img src={require('../../assets/img/notifications/low.svg')} alt="" /> :
                                                                                            null
                                                                            }
                                                                        </>
                                                                        : null
                                                                    }
                                                                </div>
                                                                <p className="action">{el.action}
                                                                    {/* by {el.operator} at {new Date(el.updated_at).toLocaleString('en-GB')} */}
                                                                </p>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    :
                                    <span className='h3'>You do not have any alerts. Try switching to last 7 days or last 30 days.</span>
                            }
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
)(BellNotifications);