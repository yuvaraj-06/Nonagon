import React from "react";

import {
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";

import GraphEE from "components/Dashboard/KOT/Graph";

class KOTGraph extends React.Component {

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
                            Kitchen Order Ticket
                            <br />
                            <span className="h4 text-muted">
                                ({this.props.daterange})
                            </span>
                        </CardTitle>
                    </div>
                </Row>
                <CardBody className='mp-0'>
                    <Container className="mt-3" fluid>
                        <Row>
                            <Col lg="12">
                                <GraphEE
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

export default KOTGraph;
