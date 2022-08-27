import React from "react";

import {
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";

import GlovesGraphPackaging from "components/Dashboard/SOPPackaging/GlovesGraph";
import HairnetGraphPackaging from "components/Dashboard/SOPPackaging/HairnetGraph";
import MaskGraphPackaging from "components/Dashboard/SOPPackaging/MaskGraph";

class SOPPackaging extends React.Component {

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
                            Packaging Space Hygiene Deviation
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
                            <Col xs="6" sm="4">
                                <HairnetGraphPackaging
                                    outlet={this.props.outlet}
                                    time={this.props.time}
                                    startDate={this.props.startDate}
                                    endDate={this.props.endDate}
                                />
                            </Col>
                            <Col xs="6" sm="4">
                                <GlovesGraphPackaging
                                    outlet={this.props.outlet}
                                    time={this.props.time}
                                    startDate={this.props.startDate}
                                    endDate={this.props.endDate}
                                />
                            </Col>
                            <Col xs="6" sm="4">
                                <MaskGraphPackaging
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

export default SOPPackaging;
