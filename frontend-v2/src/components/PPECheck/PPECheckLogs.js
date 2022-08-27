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
    outletTimezone: state.outletCode.outletTimezone
  };
};

const getPPEFeatures = (services) => {
  let a = [
    {
      dataField: "timestamp",
      text: "Timeframe",
      sort: true,
    },
  ];
  let glove = {
    dataField: "glove",
    text: "Glove Deviation",
    sort: true,
  };
  let hairnet = {
    dataField: "hairnet",
    text: "Hairnet Deviation",
    sort: true,
  };
  let mask = {
    dataField: "mask",
    text: "Mask Deviation",
    sort: true,
  };
  let media = {
    dataField: "media",
    text: "Screenshot",
    sort: false,
  };
  if (services.includes("KPPE.GD")) {
    a.push(glove);
  }
  if (services.includes("KPPE.HD")) {
    a.push(hairnet);
  }
  if (services.includes("KPPE.FMD")) {
    a.push(mask);
  }
  a.push(media);
  return a;
};

class PPECheckLogs extends React.Component {
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
          dataField: "glove",
          text: "Glove Deviation",
          sort: true,
        },
        {
          dataField: "hairnet",
          text: "Hairnet Deviation",
          sort: true,
        },
        {
          dataField: "mask",
          text: "Mask Deviation",
          sort: true,
        },
        {
          dataField: "media",
          text: "Screenshot",
          sort: false,
        },
      ],
      logsName: "PPE Check",
      outletCode: props.outlet,
      time: props.time,
      daterange: "Loading...",
      outlet: props.outlet,
      companyServices: props.companyServices,
      filterParameter: "",
      dynamicFilterArray: [],
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
          `sopDeviation/logs/${nextProps.outlet}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          var x = res.data.map((r) => ({
            timestamp: r.ts,
            glove: r.gloves,
            hairnet: r.hairnet,
            mask: r.mask,
            media: r.screenshot,
          }));
          var filterArray = getFilterArrayForDropDown(
            this.state.filterParameter,
            x
          );
          x = getHourwiseSegregation(x, nextProps.time);
          this._ismounted &&
            this.setState({
              logsData: x.reverse(),
              dynamicFilterArray: filterArray,
              daterange: handleDateRange(this.state.time, this.props.outletTimezone),
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
          outletCode: nextProps.outlet,
          companyServices: nextProps.companyServices,
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
        <div>
          <MediaLogs
            logsData={this.state.logsData}
            logsColumnInfo={
              this.state.companyServices[this.state.outletCode]
                ? getPPEFeatures(
                  this.state.companyServices[this.state.outlet].services
                )
                : [
                  {
                    dataField: "timestamp",
                    text: "Timeframe",
                    sort: true,
                  },
                ]
            }
            logsName={this.state.logsName}
            daterange={this.state.daterange}
            filterParameter={this.state.filterParameter}
            dynamicFilterArray={this.state.dynamicFilterArray}
            useHour12Format={true}
          />
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(PPECheckLogs);
