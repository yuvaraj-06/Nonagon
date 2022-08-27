import React, { Component } from 'react';
import Dashheader from "components/Headers/Dashheader"
import jwt_decode from 'jwt-decode'
import { Mixpanel } from "../../../Mixpanel/mixpanel"
import {
    Container,
    // Card,
    // Col,
    // CardHeader
} from 'reactstrap'
// import HeatmapRender from 'components/Heatmap/HeatmapRender'
// import CardBody from 'reactstrap/lib/CardBody';
import HeatmapLogs from 'components/Heatmap/HeatmapLogs';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

class HeatMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            points: [
                //with these point you can see the heatmap plotted on the image
                { x: 58, y: 63, value: 80 },
                { x: 28, y: 73, value: 90 },
                { x: 98, y: 83, value: 60 },
                //   { x: 44, y: 20, value: 90 }

                // but these point heat map are not ploting
                { x: 588, y: 625, value: 50 },
                { x: 460, y: 447, value: 40 }
            ]
        }
        Mixpanel.track('HeatMap Tab', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
        Mixpanel.time_event('HeatMap Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    componentWillUnmount() {
        Mixpanel.track('HeatMap Tab Time', { distinct_id: jwt_decode(localStorage.getItem('act')).email, email: jwt_decode(localStorage.getItem('act')).email })
    }

    render() {
        return (
            <div>
                <Dashheader title="Heatmap" />

                <Container className="mt--6" fluid>
                    <ErrorBoundary>
                        {/* <Col className='col-auto'>
                        <Card>
                            <CardHeader>
                                HeatMap
                            </CardHeader>
                            <CardBody>
                                <HeatmapRender points={this.state.points} />
                            </CardBody>
                        </Card>
                    </Col> */}
                        <HeatmapLogs />
                    </ErrorBoundary>
                </Container>
            </div>
        );
    }
}

export default HeatMap;