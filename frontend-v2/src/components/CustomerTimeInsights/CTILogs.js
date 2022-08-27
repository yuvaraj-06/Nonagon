import React from "react";
import MediaLogs from "components/LogsL/MediaLogsCopy";

import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";

import handleDateRange from "utilFunctions/handleDateRange";
import { connect } from "react-redux";
import { getHourwiseSegregation } from "utilFunctions/LogsL/getHourwiseSegregation";
import { getFilterArrayForDropDown } from "utilFunctions/LogsL/getDynamicFilterArray";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    outletCameraDetails: state.outletCode.outletCameraDetails,
    companyServices: state.services.companyServices,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class CTILogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logsData: [],
      logsColumnInfo: [
        {
          dataField: "timestamp",
          text: "Timeframe",
          sort: true,
        },
        // {
        //     dataField: "attended",
        //     text: "Attended",
        //     sort: false,
        // },
        {
          dataField: "displayCounterTime",
          text: "Display Counter Time",
          sort: false,
        },
        {
          dataField: "billingCounterTime",
          text: "Billing Counter Time",
          sort: false,
        },
        {
          dataField: "waitingAroundTime",
          text: "Customer Waiting Time",
          sort: false,
        },
        // {
        //     dataField: "duration",
        //     text: "Duration (in sec)",
        //     sort: false,
        // },
      ],
      logsName: "Customer Time Insight",
      outlet: props.outlet,
      time: props.time,
      daterange: "Loading...",
      filterParameter: "",
      dynamicFilterArray: [],
      timeZone: props.companyServices[props.outlet]
        ? props.companyServices[props.outlet].timezone
        : null,
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    axios
      .get(
        nodeBaseURL +
        `avg_time_spent/list/${nextProps.outlet}/${nextProps.time}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("act")}`,
          },
        }
      )
      .then((res) => {
        let x = res.data.map((el) => {
          return {
            timestamp: el.timestamp,
            displayCounterTime: el.avg_display_counter_timespent,
            billingCounterTime: el.avg_billing_counter_timespent,
            waitingAroundTime: el.avg_waiting_around_timespent,
          };
        });
        var filterArray = getFilterArrayForDropDown(
          this.state.filterParameter,
          x
        );
        x = getHourwiseSegregation(x, nextProps.time);
        this._ismounted &&
          this.setState({
            logsData: x.reverse(),
            dynamicFilterArray: filterArray,
            daterange: handleDateRange(nextProps.time, this.props.outletTimezone),
          });
        if (x.length === 0) {
          this._ismounted &&
            this.setState({
              daterange: `No data is available for ${nextProps.time}`,
            });
        }
      })
      .catch((err) => {
        this._ismounted &&
          this.setState({
            daterange:
              "Some Error Occured Please contact us at support@nonagon.xyz",
          });
      });
  };

  componentDidMount() {
    this.fetchData(this.state);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted && this.setState({ daterange: "Loading..." });
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <>
        <MediaLogs
          logsData={this.state.logsData}
          logsColumnInfo={this.state.logsColumnInfo}
          logsName={this.state.logsName}
          daterange={this.state.daterange}
          filterParameter={this.state.filterParameter}
          dynamicFilterArray={this.state.dynamicFilterArray}
        />
      </>
    );
  }
}

export default connect(mapStateToProps)(CTILogs);
