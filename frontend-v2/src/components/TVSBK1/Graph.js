import React, { Component } from "react";

import { Card, CardBody, CardHeader } from "reactstrap";

import ReactApexChart from "react-apexcharts";

import getPopulatedGraphData, {
  convertCTIData,
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

class TVSGraph1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: [],
      attended: [],
      unattended: [],
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
          `tvs_timespent1/list/${nextProps.outletCode}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((result) => {

          var displayCounterData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            convertCTIData(result.data, "avg_mopeds_timespent"),
            this.props.time
          );
          var billingCounterData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            convertCTIData(result.data, "avg_scooters_timespent"),
            this.props.time
          );
          var customerWaitingData = getPopulatedGraphData(
            getGraphTimeFrame(nextProps.time),
            convertCTIData(result.data, "avg_apaches_timespent"),
            this.props.time
          );

          let displayCounter = Object.values(displayCounterData);
          let billingCounter = Object.values(billingCounterData);
          let customerWaiting = Object.values(customerWaitingData);
          let timestamp = Object.keys(displayCounterData).map((item) => {
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
              displayCounter,
              billingCounter,
              customerWaiting,
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
        name: "Moped Region",
        data: this.state.displayCounter,
      },
      {
        name: "Scooters Region",
        data: this.state.billingCounter,
      },
      {
        name: "Apache Bikes Region",
        data: this.state.customerWaiting,
      },
    ];

    let options = {
      chart: {
        height: 350,
        type: "line",
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
            <span className="h4">Shows the customer insight time in different motorcycle regions.</span>
          </CardHeader>
          <CardBody className='mp-0'>
            <div id="chart">
              <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={450}
              />
            </div>

            {/* {this.state.y.reduce((a, b) => a + b) === 0 ? (
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
                            <div id="chart">

                            </div>
                        )} */}
          </CardBody>
        </Card>
      </div>
    );
  }
}

//export default Graph;

export default connect(mapStateToProps)(TVSGraph1);
