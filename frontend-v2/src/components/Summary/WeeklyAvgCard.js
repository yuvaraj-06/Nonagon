import React from 'react';

import {
    Card,
    CardBody,
    Row,
    Col
} from 'reactstrap';

import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";

class SummaryWeek extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            todayData: 0,
            weekAvg: 0
        };
    }

    getDataa() {
        axios.get(
            nodeBaseURL + `${this.props.featurePath}list/XYZ0001-S0003/week`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then(res => {
                let datesArr = Object.keys(res.data);
                let todayDate = new Date('2021-07-10T00:00:00+00:00').getDate();
                let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();

                let todayData = 0;

                if (todayDate === lastDate) {
                    // if today and the last date from the response match then update the data in state
                    todayData = res.data[datesArr[datesArr.length - 1]];
                    this.setState({ todayData: todayData });
                }

                let weekAvg = Math.round(Object.values(res.data).reduce((a, b) => {
                    return a + b;
                }, 0) / 7);

                this.setState({ weekAvg: weekAvg });
            })
            .catch(console.log);
    }

    componentDidMount() {
        this.getDataa();
    }

    render() {
        return (
            <Card className="col">
                <CardBody className="summary-card-main">
                    <div className="summary-card-title">
                        <i className="fas fa-fire" />{this.props.featureName}
                    </div>
                    <Row className="summary-data">
                        <Col className="data-box">
                            {this.state.todayData > this.state.weekAvg
                                ? `Yaaayyyy!, the number of people visiting today is higher than usual`
                                : this.state.todayData < this.state.weekAvg
                                    ? `The number of people visited is less than the weekly average`
                                    : 'There seems to be no change in the data from yesterday'}
                        </Col>
                    </Row>
                    <Row className="summary-data">
                        <Col className="today-card">
                            <div className="sum-title">
                                <i className="fas fa-circle" />Today
                            </div>
                            <div className="sum-data">
                                {this.state.todayData}
                                {this.state.todayData < this.state.weekAvg
                                    ? <img style={{ height: '20px', marginLeft: '10px' }} src={require('../../assets/img/icons/down-arrow.png')} alt="" />
                                    : this.state.todayData > this.state.weekAvg
                                        ? <img style={{ height: '20px', marginLeft: '10px' }} src={require('../../assets/img/icons/up-arrow.png')} alt="" />
                                        : <img style={{ height: '20px', marginLeft: '10px' }} src={require('../../assets/img/icons/circle.png')} alt="" />}
                            </div>
                        </Col>
                        <Col className="today-card">
                            <div className="sum-title">
                                <i className="fas fa-circle" />Average
                            </div>
                            <div className="sum-data">
                                {this.state.weekAvg}
                            </div>
                        </Col>

                        {/* <SummaryGraph /> */}
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

export default SummaryWeek;


