import React, { Component } from "react";

import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";

import Chart from "chart.js";

import { Bar } from "react-chartjs-2";

import { chartOptions, parseOptions } from "variables/charts.js";

import { nodeBaseURL } from "../../../ApiURL";
import axios from "axios";

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'

const mapStateToProps = (state) => {
    return {
        act: jwt_decode(state.act.act),
        time: state.time.time
    };
}

var colors = {
    gray: {
        100: "#f6f9fc",
        200: "#e9ecef",
        300: "#dee2e6",
        400: "#ced4da",
        500: "#adb5bd",
        600: "#8898aa",
        700: "#525f7f",
        800: "#32325d",
        900: "#212529",
    },
    theme: {
        default: "#172b4d",
        primary: "#5e72e4",
        secondary: "#f4f5f7",
        info: "#5e72e4",
        success: "#2dce89",
        danger: "#f5365c",
        warning: "#fb6340",
    },
    black: "#12263F",
    white: "#FFFFFF",
    transparent: "transparent",
};

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: [],
            y: [0],
        };
        this._ismounted = true;
        if (window.Chart) {
            parseOptions(Chart, chartOptions());
        }
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `room_occupancy/list/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((result) => {
                var x = [];
                var y = [0];
                if (this.props.time === "day") {
                    for (var k in result.data)
                        x.push(
                            new Date(k).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                timezone: 'UTC'
                            }) +
                            " to " +
                            new Date(
                                Date.parse(k) + 1 * 1 * 60 * 60 * 1000
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                timezone: 'UTC'
                            })
                        );
                    for (var i in result.data) y.push(result.data[i]);
                    if (y.length > 1) {
                        y.shift()
                    }
                    if (y.length > 1) {
                        y.shift()
                    }
                    this._ismounted && this.setState({
                        x,
                        y,
                    });
                } else if (this.props.time === "week" || "month") {
                    for (var m in result.data) x.push(new Date(m).toLocaleDateString("en-GB"));
                    for (var n in result.data) y.push(result.data[n]);
                    if (y.length > 1) {
                        y.shift()
                    }
                    if (y.length > 1) {
                        y.shift()
                    }
                    this._ismounted && this.setState({
                        x,
                        y,
                    });
                }
            })
            .catch(err => {

            });
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
        let chartExample2 = {
            options: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                },
                scales: {
                    yAxes: [
                        {
                            gridLines: {
                                color: colors.gray[200],
                                zeroLineColor: colors.gray[200],
                            },
                            ticks: {
                                callback: function (value) {
                                    return value;
                                },
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "People Count",
                            },
                        },
                    ],
                    xAxes: [
                        {

                            gridLines: {
                                drawBorder: false,
                                color: "rgba(29,140,248,0.1)",
                                zeroLineColor: "transparent",
                            },
                            ticks: {
                                padding: 20,
                                fontColor: "#9a9a9a",
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Time",
                            },
                        },
                    ],
                },
                tooltips: {
                    callbacks: {
                        label: function (item, data) {
                            var label = data.datasets[item.datasetIndex].label || "";
                            var yLabel = item.yLabel;
                            var content = "";
                            if (data.datasets.length > 1) {
                                content += label;
                            }
                            content += yLabel;
                            return content;
                        },
                    },
                },
            },
            data: {
                labels: this.state.x,
                datasets: [
                    {
                        label: "Number of people",
                        data: this.state.y,
                        maxBarThickness: 10,
                    },
                ],
            },
        };
        return (
            <Card>
                <CardHeader>
                    <span className="h4">
                        Room Occupancy is the average number of people in the store at a given
                        timeframe.
                    </span>
                </CardHeader>
                <CardBody>
                    {this.state.y.reduce((a, b) => a + b) === 0 ? (
                        <Row>
                            <Col lg="2"></Col>
                            <Col lg="8">
                                <h3>
                                    <center>No data available for {this.props.time !== 'None' ? this.props.time : new Date(this.props.startDate).toLocaleDateString() + ' to ' + new Date(this.props.endDate).toLocaleDateString()}</center>
                                </h3>
                            </Col>
                            <Col lg="2"></Col>
                        </Row>
                    ) : (
                        <div className="chart">
                            <Bar
                                data={chartExample2.data}
                                options={chartExample2.options}
                                className="chart-canvas"
                                id="chart-bars"
                            />
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    }
}

export default connect(
    mapStateToProps,
)(Graph);