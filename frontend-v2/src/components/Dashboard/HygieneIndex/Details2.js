import React, { Component } from 'react'

import {
    Card,
    CardBody,
    CardHeader,
    Row,
    Col
} from 'reactstrap'

class Details2 extends Component{

    render(){
        return(
            <>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <h5 className="h3 mb-0">How it's calculated</h5>
                            </CardHeader>

                            <CardBody>
                                Hygiene Index = (Total SOP x 0.1 / Total Deviation + Total SOP) x 5
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

export default Details2