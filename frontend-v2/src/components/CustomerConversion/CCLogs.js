import React from "react";
import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";
import handleDateRange from "utilFunctions/handleDateRange";
import { connect } from "react-redux";
import MediaLogs from "components/LogsL/MediaLogsCopy";
import { getHourwiseSegregation } from "utilFunctions/LogsL/getHourwiseSegregation";
import { getFilterArrayForDropDown } from "utilFunctions/LogsL/getDynamicFilterArray";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    companyServices: state.services.companyServices,
    outletCameraDetails: state.outletCode.outletCameraDetails,
    outletTimezone: state.outletCode.outletTimezone
  };
};

class CustomerConversionLogs extends React.Component {
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
        {
          dataField: "customer_conversion_rate",
          text: "Customer Conversion",
          sort: false,
        },
      ],
      logsName: "Customer Conversion",
      outlet: props.outlet,
      time: props.time,
      daterange: "Loading...",
      filterParameter: '',
      dynamicFilterArray: [],
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
          `customer_conversion/logs/${nextProps.outlet}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          var x = res.data;
          var filterArray = getFilterArrayForDropDown(this.state.filterParameter, x);
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
      this._ismounted &&
        this.setState({
          daterange: "Loading...",
          time: nextProps.time,
        });
      this._ismounted && this.fetchData(nextProps);
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
          useHour12Format={true}
        />
      </>
    );
  }
}

export default connect(
  mapStateToProps
)(CustomerConversionLogs);
