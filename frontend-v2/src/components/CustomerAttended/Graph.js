import React, { Component } from "react";

import { Card, CardBody, CardHeader } from "reactstrap";

import ReactApexChart from "react-apexcharts";

import getPopulatedGraphData, {
  convertCAData,
} from "utilFunctions/getPopulatedGraphData";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";

import axios from "axios";
import { nodeBaseURL } from "ApiURL";

import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import {
  getConvertedTime,
  onlyDateFormat,
} from "utilFunctions/getConvertedTime";

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
      attended: [],
      unattended: [],
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `customers_attended/list/${nextProps.outletCode}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((result) => {
          var attendedData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            convertCAData(result.data, "attended"),
            this.props.time
          );
          var unattendedData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            convertCAData(result.data, "unattended"),
            this.props.time
          );
          let attended = Object.values(attendedData);
          let unattended = Object.values(unattendedData);
          let timestamp = Object.keys(attendedData).map((item) => {
            return getConvertedTime(
              item,
              this.props.outletTimezone,
              nextProps.time === "day" || nextProps.time === "yesterday"
                ? ''
                : onlyDateFormat
            );
          });

          this._ismounted &&
            this.setState({
              timestamp,
              attended,
              unattended,
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
        name: "Attended",
        data: this.state.attended,
      },
      {
        name: "Unattended",
        data: this.state.unattended,
      },
    ];

    let options = {
      colors: ["#008FFB", "#FF6363"],
      chart: {
        height: 350,
        type: "area",
      },
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
      tooltip: {
        x: {
          format:
            this.props.time === "day" || this.props.time === "yesterday"
              ? "dd/MM/yyHH: mm"
              : "dd/MM/yyyy",
        },
      },
    };

    return (
      <div>
        <Card>
          <CardHeader>
            <span className="h4">
              Shows the number of customers attended and unattended
            </span>
          </CardHeader>
          <CardBody className='mp-0'>
            <div id="chart">
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={450}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Graph);
