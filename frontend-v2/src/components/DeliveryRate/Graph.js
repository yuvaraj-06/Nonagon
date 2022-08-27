import React, { Component } from "react";

import { Card, CardBody, CardHeader } from "reactstrap";

import ReactApexChart from "react-apexcharts";

import getPopulatedGraphData from "utilFunctions/getPopulatedGraphData";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";

import axios from "axios";
import { nodeBaseURL } from "ApiURL";

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import { getConvertedTime, onlyDateFormat } from "utilFunctions/getConvertedTime";

const mapStateToProps = (state) => {
  return {
    act: jwt_decode(state.act.act),
    time: state.time.time,
    companyServices: state.services.companyServices,
    outletCode: state.outletCode.outletCode,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: [],
      bagPrintTrue: [],
      bagPrintFalse: [],
    };
    this._ismounted = true;
    // if (window.Chart) {
    //     parseOptions(Chart, chartOptions());
    // }
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `customers/delivery_agent/list/${nextProps.outletCode}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )

        .then((result) => {
          var DRData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            result.data,
            this.props.time
          );

          let deliverRate = Object.values(DRData);
          let timestamp = Object.keys(DRData).map(item => {
            return (getConvertedTime(item, this.props.outletTimezone, nextProps.time === 'day' || nextProps.time === 'yesterday' ?
              '' : onlyDateFormat))
          });

          this._ismounted &&
            this.setState({
              timestamp,
              deliverRate,
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
    let series = [
      {
        name: "Delivery Rate",
        data: this.state.deliverRate,
      },
    ];

    let options = {
      chart: {
        height: 350,
        type: "area",
      },
      colors: ["#5e72e4", "#f5365c"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: this.state.timestamp,
      },
      yaxis: [
        {
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            },
          },
        },
      ],
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    };

    return (
      <Card>
        <CardHeader>
          <span className="h4">Shows the delivery rate.</span>
        </CardHeader>
        <CardBody className='mp-0'>
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={450}
          />
        </CardBody>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(Graph);
