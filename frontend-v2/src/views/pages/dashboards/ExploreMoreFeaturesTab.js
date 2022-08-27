import React from "react";
import {
    Container,
} from 'reactstrap'

import DashheaderNTS from "components/Headers/DashheaderNTS"

import ExploreMoreFeatures from 'components/ExploreMoreFeatures/ExploreMoreFeatures'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"

import { connect } from 'react-redux';
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = state => {
    return {
        outletCode: state.outletCode.outletCode,
    };
};

class ExploreMoreFeaturesTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Explore More Features Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Explore More Features Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Explore More Features Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <DashheaderNTS title="Explore More Features" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <ExploreMoreFeatures />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(ExploreMoreFeaturesTab);