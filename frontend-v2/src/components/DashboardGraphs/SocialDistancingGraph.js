import React from "react";

import {
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";

import SDGraph from "components/Dashboard/SocialDistancing/Graph";

class SocialDistancingGraph extends React.Component {

    constructor(props) {
        super(props);
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
                            Social Distancing Deviations
                            <br />
                            <span className="h4 text-muted">
                                ({this.props.daterange})
                            </span>
                        </CardTitle>
                    </Col>
                </Row>
                <CardBody className='mp-0'>
                    <Container className="mt-3" fluid>
                        <SDGraph
                            outlet={this.props.outlet}
                            time={this.props.time}
                            daterange={this.props.daterange}
                            startDate={this.props.startDate}
                            endDate={this.props.endDate}
                        />
                    </Container>
                </CardBody>
            </div >
        );
    }
}

export default SocialDistancingGraph;
