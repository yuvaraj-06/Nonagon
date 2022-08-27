import React from "react";
import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";
import handleDateRange from "utilFunctions/handleDateRange";
import { connect } from 'react-redux';
import MediaLogs from "components/LogsL/MediaLogsCopy";
import { getHourwiseSegregation } from "utilFunctions/LogsL/getHourwiseSegregation";
import { getFilterArrayForDropDown } from "utilFunctions/LogsL/getDynamicFilterArray";

const mapStateToProps = (state) => {
  return {
    outlet: state.outletCode.outletCode,
    time: state.time.time,
    companyServices: state.services.companyServices,
    outletTimezone: state.outletCode.outletTimezone
  };
}

class DemographicLogs extends React.Component {
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
          dataField: "male",
          text: "Male",
          sort: false,
        },
        {
          dataField: "female",
          text: "Female",
          sort: false,
        },
      ],
      logsName: 'Demographic',
      outlet: props.outlet,
      time: props.time,
      daterange: "Loading...",
      filterParameter: '',
      dynamicFilterArray: [],
      timeZone: props.companyServices[props.outlet] ? props.companyServices[props.outlet].timezone : null
    };
    this._ismounted = true;
  }

  fetchData = (nextProps) => {
    this._ismounted && axios.get(
      nodeBaseURL +
      `demographics/gender/${nextProps.outlet}/${nextProps.time}`,
      {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('act')}`

        }
      }
    )
      .then((res) => {
        var time = [];
        var logs = [];
        var y;
        if (nextProps.time === "day" || nextProps.time === "yesterday") {
          // if (res.data.length !== undefined) {
          for (let i in res.data) {
            time.push(i);
          }
          time.sort();
          for (let i in time) {
            y = {
              timestamp: time[i],
              male: res.data[time[i]].male,
              female: res.data[time[i]].female,
            };
            logs.push(y);
          }
          // }
        } else if (nextProps.time === "week" || "month") {
          for (let i in res.data) {
            time.push(i);
          }
          time.sort();
          for (let i in time) {
            y = {
              timestamp: time[i],
              male: res.data[time[i]].male,
              female: res.data[time[i]].female,
            };
            logs.push(y);
          }
        }
        var filterArray = getFilterArrayForDropDown(this.state.filterParameter, logs)
        logs = getHourwiseSegregation(logs, nextProps.time)
        this._ismounted && this.setState({ logsData: logs.reverse(), dynamicFilterArray: filterArray, daterange: handleDateRange(nextProps.time, this.props.outletTimezone) });
        if (logs.length === 0) {
          this._ismounted && this.setState({
            daterange: `No data is available for ${nextProps.time}`
          })
        }
      })
      .catch(err => {

        this._ismounted && this.setState({ daterange: "Some Error Occured Please contact us at support@nonagon.xyz" })
      });
  };

  componentDidMount() {
    this.fetchData(this.state);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this._ismounted && this.setState({ daterange: 'Loading...', time: nextProps.time, timeZone: nextProps.companyServices[nextProps.outlet] ? nextProps.companyServices[nextProps.outlet].timezone : null })
      this._ismounted && this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <>
        <div>
          <MediaLogs
            logsData={this.state.logsData}
            logsColumnInfo={this.state.logsColumnInfo}
            logsName={this.state.logsName}
            daterange={this.state.daterange}
            filterParameter={this.state.filterParameter}
            dynamicFilterArray={this.state.dynamicFilterArray}
          />
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
)(DemographicLogs);
