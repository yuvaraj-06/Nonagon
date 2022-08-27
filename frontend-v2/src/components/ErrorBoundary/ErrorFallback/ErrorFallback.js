import React from "react";

import {
    // Table,
    Row,
    Col,
    Card,
    // CardHeader,
    CardBody,
    // Button,
    // Modal
} from 'reactstrap'

import './ErrorFallback.scss'
class ErrorFallback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this._ismounted = true;
    }


    componentDidMount() {
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <>
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardBody className="fb-bg">
                                <Row className="fb-container">
                                    <Row className="fb-card">
                                        <div className="fb-icon">!</div>
                                        <div className="fb-msg">Hey, we are facing an error while displaying this feature at the moment. Please switch to another feature tab and then do a hard reload.</div>
                                        <div className="fb-btn">
                                            <button className="fb-btn report" onClick={console.log('err')}>Report</button>
                                        </div>
                                    </Row>
                                </Row >
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default ErrorFallback;
