import React, { Component } from "react";

import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";

import Chart from "chart.js";

import { Pie } from "react-chartjs-2";

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

let data = [];

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
class GenderGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: ["Male", "Female"],
      data: [0, 0],
      activeNav: 1,
      chartExample1Data: "data1",
    };
    this._ismounted = true;
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  fetchData = (nextProps) => {
    this._ismounted && axios.get(
      nodeBaseURL + `demographics/aggregate/${nextProps.outlet}/${nextProps.time}?fromdate=${nextProps.startDate}&tilldate=${nextProps.endDate}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`

        }
      }
    )
      .then((result) => {
        data = [0, 0];
        data[0] = result.data.male;
        data[1] = result.data.female;
        this._ismounted && this.setState({
          data: data,
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
    let chartExample6 = {
      data: {
        labels: this.state.labels,
        datasets: [
          {
            data: this.state.data,
            backgroundColor: [colors.theme["danger"], colors.theme["primary"]],
            label: "Gender Distribution",
          },
        ],
      },
      options: {
        rotation: (0.5 * Math.PI),
        responsive: true,
        legend: {
          position: "top",
          display: true,
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    };
    return (
      <Card>
        <CardHeader>
          <h6 className="h4 text-muted">Demographics</h6>
          <h5 className="h3 mb-0">Gender Distribution</h5>
        </CardHeader>
        <CardBody className='mp-0'>
          {this.state.data[0] === 0 && this.state.data[1] === 0 ?
            <Row>
              <Col lg="2">

              </Col>
              <Col lg="8">
                <h3>
                  <center>No data available for {this.props.time !== 'None' ? this.props.time : new Date(this.props.startDate).toLocaleDateString() + ' to ' + new Date(this.props.endDate).toLocaleDateString()}</center>
                </h3>
              </Col>
              <Col lg="2">

              </Col>
            </Row>
            :
            <div className="chart">
              <Pie
                data={chartExample6.data}
                options={chartExample6.options}
                className="chart-canvas"
                id="chart-pie"
              />
            </div>
          }
        </CardBody>
      </Card >
    );
  }
}

//export default GenderGraph;

export default connect(
  mapStateToProps,
)(GenderGraph);