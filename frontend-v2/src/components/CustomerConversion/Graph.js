import React, { Component } from "react";

import { Card, CardBody, CardHeader } from "reactstrap";

import ReactApexChart from "react-apexcharts";

import getPopulatedGraphData, {
} from "utilFunctions/getPopulatedGraphData";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";

import { convertCCData } from 'utilFunctions/getPopulatedGraphData';
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
      timeZone: props.companyServices[props.outlet]
        ? props.companyServices[props.outlet].timezone
        : null,
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `customer_conversion/list/${nextProps.outletCode}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )

        .then((result) => {

          var ccRateData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            convertCCData(result.data, "cc_rate"),
            this.props.time
          );
          let ccRate = Object.values(ccRateData);
          let timestamp = Object.keys(ccRateData).map(item => {
            return (getConvertedTime(item, this.props.outletTimezone, nextProps.time === 'day' || nextProps.time === 'yesterday' ? '' : onlyDateFormat));
          });

          this._ismounted &&
            this.setState({
              timestamp,
              ccRate,
            });
        })
        .catch(console.log);
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted && this.setState({ timeZone: nextProps.companyServices[nextProps.outletCode] ? nextProps.companyServices[nextProps.outletCode].timezone : null });
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    let series = [
      {
        name: "Customer Conversion",
        data: this.state.ccRate,
      },
    ];

    let options = {
      chart: {
        height: 350,
        type: "line",
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
          <span className="h4">Shows the customer conversion rate.</span>
        </CardHeader>
        <CardBody className='mp-0'>
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={450}
          />
        </CardBody>
      </Card>
    );
  }
}

//export default Graph;

export default connect(mapStateToProps)(Graph);
