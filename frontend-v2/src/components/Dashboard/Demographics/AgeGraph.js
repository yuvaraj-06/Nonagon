import React, { Component } from "react";

import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";

import Chart from "chart.js";

import { Bar } from "react-chartjs-2";

import { chartOptions, parseOptions } from "variables/charts.js";

import { nodeBaseURL } from "../../../ApiURL";
import axios from 'axios';

import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time
  };
};

class AgeGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: [],
      y: [0]
    };
    this._ismounted = true;
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  fetchData = (nextProps) => {
    this._ismounted && axios.get(
      nodeBaseURL +
      `demographics/agegroup/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`

        }
      }
    )
      .then((result) => {
        this._ismounted && this._ismounted && this.setState({
          y: Object.values(result.data),
          x: Object.keys(result.data)
        });
      })
      .catch(err => {

      });
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) { this.fetchData(nextProps); }
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
          align: "end"
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
                labelString: 'Number of Visitors'
              }
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
                labelString: 'Age Groups'
              }
            },
          ],
        },
      },
      data: {
        labels: this.state.x,
        datasets: [
          {
            label: "Visitors Count",
            data: this.state.y,
            maxBarThickness: 10,
          },
        ],
      },
    };
    return (
      <Card>
        <CardHeader>
          <h6 className="h4 text-muted">Demographics</h6>
          <h5 className="h3 mb-0">Age Group Count</h5>
        </CardHeader>
        <CardBody className='mp-0'>
          {
            this.state.y.reduce((a, b) => a + b) === 0 ?
              <Row>
                <Col lg="2">

                </Col>
                <Col lg="8">
                  <h3>                  <center>No data available for {this.props.time !== 'None' ? this.props.time : new Date(this.props.startDate).toLocaleDateString() + ' to ' + new Date(this.props.endDate).toLocaleDateString()}</center></h3>
                </Col>
                <Col lg="2">

                </Col>
              </Row>
              :
              <div className="chart">
                <Bar
                  data={chartExample2.data}
                  options={chartExample2.options}
                  className="chart-canvas"
                  id="chart-bars"
                />
              </div>
          }
        </CardBody>
      </Card>
    );
  }
}

// export default AgeGraph;

export default connect(
  mapStateToProps,
)(AgeGraph);