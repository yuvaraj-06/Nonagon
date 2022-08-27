import React from 'react';

import {
    Card,
    CardBody,
    Row,
    Col
} from 'reactstrap';

import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";

class SummaryCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            todayData: 0,
            yesterdayData: 0
        };
    }

    getData() {
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
                let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

                let todayData = 0;
                let yesterdayData = 0;

                if (todayDate === lastDate) {
                    // if today and the last date from the response match then update the data in state
                    todayData = res.data[datesArr[datesArr.length - 1]];
                    this.setState({ todayData: todayData });
                }

                if (todayDate - 1 === previousDate) {
                    // if the response has yesterday's data, then update it in the state
                    yesterdayData = res.data[datesArr[datesArr.length - 2]];
                    this.setState({ yesterdayData: yesterdayData });
                }
            })
            .catch(console.log);
    }

    componentDidMount() {
        this.getData();
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
                            {this.state.todayData > this.state.yesterdayData
                                ? `You're doing great today! More number of people have visited compared to yesterday`
                                : this.state.todayData < this.state.yesterdayData
                                    ? `Compared to yesterday, less number of people have visited today`
                                    : 'There seems to be no change in the data from yesterday'}
                        </Col>
                    </Row>
                    <Row className="summary-data weekly-avg">
                        <Col className="bars-card">
                            <div className="sum-data">
                                {this.state.todayData}
                                {this.state.todayData < this.state.yesterdayData
                                    ? <img style={{ height: '20px', marginLeft: '10px' }} src={require('../../assets/img/icons/down-arrow.png')} alt="" />
                                    : this.state.todayData > this.state.yesterdayData
                                        ? <img style={{ height: '20px', marginLeft: '10px' }} src={require('../../assets/img/icons/up-arrow.png')} alt="" />
                                        : <img style={{ height: '20px', marginLeft: '10px' }} src={require('../../assets/img/icons/circle.png')} alt="" />}
                            </div>
                            <div className="sum-title yesterday">
                                Today
                            </div>
                        </Col>
                        <Col className="bars-card">
                            <div className="sum-data">
                                {this.state.yesterdayData}
                            </div>
                            <div className="sum-title today">
                                Yesterday
                            </div>
                        </Col>

                        {/* <SummaryGraph /> */}
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

export default SummaryCard;