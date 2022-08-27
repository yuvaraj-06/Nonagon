import React from "react";
import {
    Container,
    // Row, Col, Card
} from 'reactstrap'

import Dashheader from "components/Headers/Dashheader"
import FMLogs from 'components/FloorMopping/FMLogs'

import { Mixpanel } from "../../../Mixpanel/mixpanel"
import jwt_decode from "jwt-decode";
import { connect } from 'react-redux';
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary";

const mapStateToProps = state => {
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
    };
};

class FloorMoppingTab extends React.Component {
    constructor(props) {
        super(props)
        Mixpanel.track('Floor Mopping Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('Floor Mopping Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }
    componentWillUnmount() {
        Mixpanel.track('Floor Mopping Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    render() {
        return (
            <>
                <Dashheader title="Floor Mopping" />
                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        <FMLogs />
                    </ErrorBoundary>
                </Container>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(FloorMoppingTab);