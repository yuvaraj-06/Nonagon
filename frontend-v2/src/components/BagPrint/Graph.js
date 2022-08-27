import React, { Component } from "react";

import { Card, CardBody, CardHeader } from "reactstrap";

import ReactApexChart from 'react-apexcharts';

import getPopulatedGraphData, { convertBagPrintData } from "utilFunctions/getPopulatedGraphData";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";

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

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp: [],
            bagPrintTrue: [],
            bagPrintFalse: []
        };
        this._ismounted = true;
        // if (window.Chart) {
        //     parseOptions(Chart, chartOptions());
        // }
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `bag_print/list/${nextProps.outletCode}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )

            .then((result) => {

                // let testData = [
                //     {
                //         "ts": "2021-07-30T04:00:00+00:00",
                //         "bag_print_true": 2,
                //         "bag_print_false": 0
                //     },
                //     {
                //         "ts": "2021-07-30T05:00:00+00:00",
                //         "bag_print_true": 4,
                //         "bag_print_false": 1
                //     },
                //     {
                //         "ts": "2021-07-30T07:00:00+00:00",
                //         "bag_print_true": 2,
                //         "bag_print_false": 7
                //     },
                //     {
                //         "ts": "2021-07-30T08:00:00+00:00",
                //         "bag_print_true": 2,
                //         "bag_print_false": 3
                //     },
                //     {
                //         "ts": "2021-07-30T10:00:00+00:00",
                //         "bag_print_true": 2,
                //         "bag_print_false": 6
                //     },
                // ];

                var bagPrintTrueData = getPopulatedGraphData(getGraphTimeFrame(nextProps.time), convertBagPrintData(result.data, 'bag_print_true'), this.props.time);
                var bagPrintFalseData = getPopulatedGraphData(getGraphTimeFrame(nextProps.time), convertBagPrintData(result.data, 'bag_print_false'), this.props.time);

                let bagPrintTrue = Object.values(bagPrintTrueData);
                let bagPrintFalse = Object.values(bagPrintFalseData);
                let timestamp = Object.keys(bagPrintFalseData);

                this._ismounted && this.setState({
                    timestamp,
                    bagPrintTrue,
                    bagPrintFalse
                });
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
        let series = [{
            name: 'Bags Printed',
            data: this.state.bagPrintTrue
        }, {
            name: 'Bags Not Printed',
            data: this.state.bagPrintFalse
        }];

        let options = {
            chart: {
                height: 350,
                type: 'area'
            },
            colors: ['#5e72e4', '#f5365c'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                categories: this.state.timestamp
            },
            yaxis: [
                {
                    labels: {
                        formatter: function (val) {
                            return val.toFixed(0);
                        }
                    }
                }
            ],
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        };

        return (
            <Card>
                <CardHeader>
                    <span className="h4">
                        Shows the number of bags printed and not printed
                    </span>
                </CardHeader>
                <CardBody className='mp-0'>
                    <ReactApexChart options={options} series={series} type='area' height={450} />
                </CardBody>
            </Card>
        );
    }
}

//export default Graph;

export default connect(
    mapStateToProps,
)(Graph);