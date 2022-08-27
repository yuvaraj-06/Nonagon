import React, { Component } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { nodeBaseURL } from "ApiURL";
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time,
        companyServices: state.services.companyServices,
        outletCode: state.outletCode.outletCode
    };
};

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emotionData: {
                HAPPY: 0,
                SAD: 0,
                ANGRY: 0,
                CONFUSED: 0,
                DISGUSTED: 0,
                SURPRISED: 0,
                CALM: 0,
                FEAR: 0
            },
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `customer_emotions/aggregate/${nextProps.outletCode}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {

                // let sampleData = {
                //     HAPPY: 5,
                //     SAD: 8,
                //     ANGRY: 4,
                //     CONFUSED: 3,
                //     DISGUSTED: 6,
                //     SURPRISED: 2,
                //     CALM: 7,
                //     FEAR: 10
                // };

                this._ismounted && this.setState({ emotionData: res.data });
            })
            .catch(console.log);
    };

    componentDidMount() {
        this.fetchData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.fetchData(nextProps);
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        let series = Object.values(this.state.emotionData);

        let sum = series.reduce((a, b) => a + b, 0);

        var options = {
            chart: {
                type: 'pie',
            },
            // dataLabels: {
            //     enabled: true,
            //     formatter: function (val) {
            //         return (val / 100) * sum;
            //     },
            // },
            legend: {
                show: true
            },
            colors: ['#F7FD04', '#1768AC', '#FF3F00', '#88FFF7', '#CDF3A2', '#F8485E', '#FFBCBC', '#b2b1b9'],
            labels: Object.keys(this.state.emotionData),
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: '100%'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        return (
            <Card>
                <CardHeader>
                    <span className="h4">
                        Shows emotions of visiting customers.
                    </span>
                </CardHeader>
                <CardBody className='mp-0'>
                    {sum > 0 ?
                        < div id="chart">
                            <ReactApexChart options={options} series={series} type='pie' height={450} />
                        </div>
                        :
                        <span className='h4'>No data available.</span>
                    }
                </CardBody>
            </Card >
        );
    }
}

export default connect(
    mapStateToProps,
)(Chart);