import React, { Component } from 'react';

import {
    Card, CardTitle,
    Row,
    Col
} from 'reactstrap';

import SummaryCard from './SummaryCard.js';
import { getSummaryCards } from './getSummaryCards';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        outletCode: state.outletCode.outletCode,
        companyServices: state.services.companyServices
    };
};

class SummaryTabCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            peoeplCountData: '',
            hygieneIndexData: '',
            moppingData: '',
            billingCounterData: '',
            sopMaskDeviationData: '',
            demographicsMaleData: '',
            demographicsFemaleData: '',
            printCount: '',
            notPrintCount: '',
            packagingEfficiency: '',
            services: props.companyServices[props.outletCode] ? props.companyServices[props.outletCode].services : []
        };
        this._ismounted = true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this._ismounted && this.setState({
            services: nextProps.companyServices[nextProps.outletCode] ? nextProps.companyServices[nextProps.outletCode].services : []
        });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {

        return (
            <Card>
                <CardTitle tag="h3" className="text-uppercase mt-5 px-5">
                    Your Summary<br /><br />
                </CardTitle>

                <div>
                    <Row className='summary-card-container'>
                        {
                            getSummaryCards(this.state.services)
                                .map((card, index) =>
                                    <Col sm="12" md="6" lg="4" key={index}>
                                        <SummaryCard
                                            data={card}
                                            outletCode={this.props.outletCode} />
                                    </Col>
                                )
                        }
                    </Row>
                </div>
            </Card >
        );
    }
}

export default connect(
    mapStateToProps,
)(SummaryTabCard);
