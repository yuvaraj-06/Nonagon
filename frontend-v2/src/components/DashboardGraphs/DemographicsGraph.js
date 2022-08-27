import React from "react";

import {
    CardBody,
    CardTitle,
    Container,
    Row,
    Col,
} from "reactstrap";

import GenderGraph from "components/Dashboard/Demographics/GenderGraph";
import AgeGraph from "components/Dashboard/Demographics/AgeGraph";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
};

class DemographicsGraph extends React.Component {

    render() {
        return (
            <div>
                <Row>
                    <div className="col">
                        <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
                            Demographics
                            <br />                            
                            <span className="h4 text-muted">
                                ({this.props.daterange})
                            </span>
                        </CardTitle>
                        <p className="h6 mt-5 px-5">The AI analyses the gender and age group of customers, provided the face is clearly visible.</p>
                    </div>
                </Row>
                <CardBody className='mp-0'>
                    <Container fluid>
                        <Row>
                            {
                                this.props.act.services.includes('CI.GRM') ?
                                    <Col>
                                        <GenderGraph
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
                                this.props.act.services.includes('CI.AE') ?
                                    <Col>
                                        <AgeGraph
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
    mapStateToProps,
)(DemographicsGraph);