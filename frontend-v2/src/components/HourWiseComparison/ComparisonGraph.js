import React, { Component } from "react";
import Chart from "react-apexcharts";
import { Row, Col, Card, CardBody } from 'reactstrap';
import axios from 'axios';
import { loginNodeBaseURL } from "ApiURL";
import CardHeader from "reactstrap/lib/CardHeader";
import { connect } from 'react-redux';
import { getConvertedTime, ISOFormat } from "utilFunctions/getConvertedTime";
import { getDayStart, getTimestampList } from "utilFunctions/LogsL/getHourwiseSegregation";

const mapStateToProps = (state) => {
    return {
        companyServices: state.services.companyServices,
        outletCode: state.outletCode.outletCode,
        outletTimezone: state.outletCode.outletTimezone
    }
}

class ComparisonGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: [0],
            week: [0],
            month: [0],
            hourLabels: getTimestampList(getDayStart(), 'day').map(item => {
                return getConvertedTime(
                    item,
                    props.outletTimezone,
                    ISOFormat)
            })
        };
        this._ismounted = true;
    }

    fetchData = (route, outletCode) => {
        axios.get(`${loginNodeBaseURL}${route}/${outletCode}/`)
            .then(res => {
                this._ismounted && this.setState({
                    day: Object.values(res.data.day).map(i => { return i.toFixed(0); }),
                    week: Object.values(res.data.week).map(i => { return i.toFixed(0); }),
                    month: Object.values(res.data.month).map(i => { return i.toFixed(0); }),
                    // hourLabels: Object.keys(res.data.day)
                });
            })
            .catch(err => {

            });
    };

    componentDidMount() {
        this._ismounted && this.fetchData(this.props.route, this.props.outletCode);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this._ismounted && this.fetchData(nextProps.route, nextProps.outletCode);
    }

    render() {
        // console.log(this.state.hourLabels.map(item => item.split('+')[0]));
        let series = [{
            name: 'Today',
            type: 'line',
            data: this.state.day,
        }, {
            name: 'Last 7 Days',
            type: 'area',
            data: this.state.week
        }, {
            name: 'Last 30 Days',
            type: 'line',
            data: this.state.month
        }];
        let options = {
            chart: {
                height: 'auto',
                type: 'line',
                stacked: false,
                toolbar: {
                    show: true,
                    offsetX: 0,
                    offsetY: 0,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: false,
                        reset: true | '<img src="/static/icons/reset.png" width="20">',
                        customIcons: []
                    },
                    export: {
                        csv: {
                            filename: undefined,
                            columnDelimiter: ',',
                            headerCategory: 'category',
                            headerValue: 'value',
                            dateFormatter(timestamp) {
                                return new Date(timestamp).toDateString();
                            }
                        },
                        svg: {
                            filename: undefined,
                        },
                        png: {
                            filename: undefined,
                        }
                    },
                    autoSelected: 'zoom'
                },
            },
            stroke: {
                width: [3, 2, 3],
                curve: 'smooth',
                dashArray: [3, 3, 3]
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },

            fill: {
                opacity: [0.85, 0.25, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: this.state.hourLabels.map(item => {
                return item.split('+')[0].split('T')[1].split(':').slice(0, 2).join(':')
            }),
            markers: {
                size: 0
            },
            xaxis: {
                title: {
                    text: 'Hourly Averages',
                },
                type: 'category'
            },
            yaxis: {
                title: {
                    text: this.props.dataType,
                },
                min: 0
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0) + ' Count';
                        }
                        return y;
                    }
                }
            }
        };
        return (
            <div>
                <Row>
                    <Col className='mp-0'>
                        <Card>
                            <CardHeader className='h3'>
                                Hourly averages of last 7 days to last 30 days
                                <span className='h5'>(in outlet timezone)</span>

                            </CardHeader>
                            <CardBody className='mp-0'>
                                <Chart
                                    options={options}
                                    series={series}
                                    type="line"
                                    width="100%"
                                    height='500px'
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default connect(
    mapStateToProps
)(ComparisonGraph);