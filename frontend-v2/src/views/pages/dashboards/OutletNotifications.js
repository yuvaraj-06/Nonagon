import React from "react";
import Notifications from 'components/Notifications/OutletNotifications'
import jwt_decode from 'jwt-decode';
import { Mixpanel } from 'Mixpanel/mixpanel'
import {
    Container,
} from 'reactstrap'
// import { NotifyWrapper } from 'components/Alerts/Notify';
import Dashheader from "components/Headers/Dashheader"
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";
class OutletNotifications extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: jwt_decode(localStorage.getItem('act')).name,
        }
        // NotifyWrapper.success("By Accepting / Rejecting a notification, you help us improve our results at your store")
        Mixpanel.track('OutletNotifications Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('OutletNotifications Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('OutletNotifications Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <Dashheader title="Outlet Notifications" timeSelect={true} />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <Notifications
                            showNotifications={true}
                            time={"week"}
                            name={this.state.name}
                        />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default OutletNotifications;