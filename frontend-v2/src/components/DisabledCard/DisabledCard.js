import React from 'react';
import { Card, CardBody, Row, Col, UncontrolledTooltip, CardTitle } from 'reactstrap';

class DisabledCard extends React.Component {

    render() {
        return (
            <div>
                {/* Disabled card start */}
                <Card className="card-stats" style={{ backgroundColor: '#d3d3d3' }} id={`tooltip611234743${this.props.cardKey}`}>
                    <CardBody>
                        <Row>
                            <div className="col" >
                                <CardTitle
                                    style={{ backgroundColor: '#d3d3d3' }}
                                    tag="h5"
                                    className="text-uppercase text-muted mb-0"
                                >
                                    {this.props.data.title}
                                </CardTitle>
                            </div>
                            <Col className="col-auto">
                                <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow" >
                                    <i className={this.props.data.icon} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <div className="col">
                                <span className="h5 tex-muted">You have not subscribed to this feature</span>
                                <br />
                            </div>
                        </Row>
                    </CardBody>
                </Card>
                {/* Disabled cards end */}
                <UncontrolledTooltip
                    delay={0}
                    placement="top"
                    target={`tooltip611234743${this.props.cardKey}`}
                >
                    {this.props.data.description}
                </UncontrolledTooltip>
            </div>
        )

    }
}

export default DisabledCard;