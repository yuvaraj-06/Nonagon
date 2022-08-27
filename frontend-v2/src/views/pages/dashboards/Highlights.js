import React from "react";
import {
    Container,
} from 'reactstrap'

import DashheaderNTS from "components/Headers/DashheaderNTS"

import HighlightsCard from 'components/HighlightsTab/HighlightsCard'

import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"

import { connect } from 'react-redux';
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
    };
};

class HighlightsTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Highlights Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Highlights Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Highlights Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    render() {
        return (
            <>
                <DashheaderNTS title="Your Highlights" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <HighlightsCard />
                    </ErrorBoundary>
                </Container>

            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(HighlightsTab);