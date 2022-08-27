import React, { Component } from "react";

import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";

import Chart from "chart.js";

import { Line } from "react-chartjs-2";

import { chartOptions, parseOptions } from "variables/charts.js";

import getPopulatedGraphData, { convertPPEData } from "utilFunctions/getPopulatedGraphData";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";
import { getConvertedTime, hour24TimeFormat, graphDateFormat } from "utilFunctions/getConvertedTime";

import { nodeBaseURL } from "../../../ApiURL";
import axios from 'axios';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    companyServices: state.services.companyServices,
    outletCode: state.outletCode.outletCode,
    outletTimezone: state.outletCode.outletTimezone
  };
};

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
class MaskGraph extends Component {
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
      `sopDeviation/list/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`

        }
      }
    )
      .then((result) => {
        var finalData = getPopulatedGraphData(getGraphTimeFrame(nextProps.time), convertPPEData(result.data, 'mask'), this.props.time);

        let y = Object.values(finalData);
        let x = Object.keys(finalData).map(item => {
          return getConvertedTime(
            item,
            this.props.outletTimezone,
            this.props.time === 'day' || this.props.time === 'yesterday' ? hour24TimeFormat : graphDateFormat
          );
        });

        this._ismounted && this.setState({
          x,
          y,
        });
      })
      .catch(console.log);
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted && this.setState({
        time: nextProps.time,
      });
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    let chartExample2 = {
      options: {
        display: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: "top",
          align: "end",
        },
        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },
        responsive: true,
        scales: {
          yAxes: [
            {

              gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.0)",
                zeroLineColor: "transparent",
              },
              ticks: {
                callback: function (value) {
                  if (Number.isInteger(value)) return value;
                },
                suggestedMin: 0,
                suggestedMax: 5,
                padding: 20,
                fontColor: "#9a9a9a",
              },
              scaleLabel: {
                display: true,
                labelString: "Mask Deviations Count",
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
      },
      data: {
        labels: this.state.x,
        datasets: [
          {
            label: "Mask Deviations",
            data: this.state.y,
            backgroundColor: colors.theme.info,
            maxBarThickness: 10,
          },
        ],
      },
    };
    return (
      <Card>
        <CardHeader>
          <h6 className="h4 text-muted">PPE Check</h6>
          <h5 className="h3 mb-0">
            Mask not worn detection

          </h5>
        </CardHeader>
        <CardBody className='mp-0'>
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
              <Line
                data={chartExample2.data}
                options={chartExample2.options}
                id="chart-sales"
                className="chart-canvas"
              />
            </div>
          )}
        </CardBody>
      </Card>
    );
  }
}

//export default MaskGraph;

export default connect(
  mapStateToProps,
)(MaskGraph);