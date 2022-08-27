import React from "react";

import {
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";

import Graph from "components/Dashboard/HygieneIndex/Graph";
import Details from "components/Dashboard/HygieneIndex/Details";

class HygieneIndexGraph extends React.Component {

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
                    <div className="col">
                        <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
                            Hygiene Index
                            <br />
                            <span className="h4 text-muted">
                                ({this.props.daterange})
                            </span>
                        </CardTitle>
                    </div>
                </Row>
                <CardBody className='mp-0'>
                    <Container className="mt-3" fluid>
                        <Details
                            outlet={this.props.outlet}
                            time={this.props.time}
                            startDate={this.props.startDate}
                            endDate={this.props.endDate}
                        />
                        <Row>
                            <Col>
                                <Graph
                                    outlet={this.props.outlet}
                                    time={this.props.time}
                                    startDate={this.props.startDate}
                                    endDate={this.props.endDate}
                                />
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </div >
        );
    }
}

export default HygieneIndexGraph;
