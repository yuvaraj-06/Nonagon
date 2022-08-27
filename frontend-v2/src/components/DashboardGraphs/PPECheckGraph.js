import React from "react";

import {
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";

import GlovesGraph from "components/Dashboard/PPECheck/GlovesGraph";
import HairnetGraph from "components/Dashboard/PPECheck/HairnetGraph";
import MaskGraph from "components/Dashboard/PPECheck/MaskGraph";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
};

class PPECheckGraph extends React.Component {

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
                            PPE Check
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
                            {
                                this.props.act.services.includes('KPPE.HD') ?
                                    <Col>
                                        <HairnetGraph
                                            outlet={this.props.outlet}
                                            time={this.props.time}
                                            startDate={this.props.startDate}
                                            endDate={this.props.endDate}
                                        />
                                    </Col>
                                    :
                                    null
                            }
                            {
                                this.props.act.services.includes('KPPE.GD') ?
                                    <Col>
                                        <GlovesGraph
                                            outlet={this.props.outlet}
                                            time={this.props.time}
                                            startDate={this.props.startDate}
                                            endDate={this.props.endDate}
                                        />
                                    </Col>
                                    :
                                    null
                            }
                            {
                                this.props.act.services.includes('KPPE.FMD') ?
                                    <Col>
                                        <MaskGraph
                                            outlet={this.props.outlet}
                                            time={this.props.time}
                                            startDate={this.props.startDate}
                                            endDate={this.props.endDate}
                                        />
                                    </Col>
                                    :
                                    null
                            }
                        </Row>
                    </Container>
                </CardBody>
            </div >
        );
    }
}

export default connect(
    mapStateToProps
)(PPECheckGraph);
