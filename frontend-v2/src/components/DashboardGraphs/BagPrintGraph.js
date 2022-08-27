import React from "react";

import {
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";

import handleDateRange from "utilFunctions/handleDateRange";
import Graph from "components/BagPrint/Graph";

class BagPrintGraph extends React.Component {

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
                            Packaging Print
                            <br />
                            <span className="h4 text-muted">
                                ({handleDateRange(this.props.time, this.props.outletTimezone)})
                            </span>
                        </CardTitle>
                    </div>
                </Row>
                <CardBody className='mp-0'>
                    <Container className="mt-3" fluid>
                        <Row>
                            <Col lg="12">
                                <Graph />
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </div >
        );
    }
}

export default BagPrintGraph;
