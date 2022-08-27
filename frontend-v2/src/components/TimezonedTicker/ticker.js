import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import Clock from 'react-live-clock';

const convertToOutletTime = (timestamp, timezone) => {
    var m = moment.utc(timestamp);
    m.tz(timezone);
    return {
        time: m.format("LT"),
        zone: m.zoneAbbr()
    }
}

const mapStateToProps = (state) => {
    return {
        outletCode: state.outletCode.outletCode,
        companyServices: state.services.companyServices,

    };
}

class MyComponent extends React.Component {
    render() {
        return (
            <div>
                &nbsp;&nbsp;
                <Clock
                    format={'HH:mm'}
                    ticking={true}
                    timezone={this.props.companyServices[this.props.outletCode] ? this.props.companyServices[this.props.outletCode].timezone : null} />
                &nbsp;
                <span>{convertToOutletTime(this.props.time, this.props.companyServices[this.props.outletCode] ? this.props.companyServices[this.props.outletCode].timezone : null).zone}</span>
                &nbsp;&nbsp;
            </div>
        )
    }
}

export default connect(
    mapStateToProps
)(MyComponent)