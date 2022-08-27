import React from "react";
import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";
import jwt_decode from "jwt-decode";
import handleDateRange from "utilFunctions/handleDateRange";
import { connect } from "react-redux";
import MediaLogs from "components/LogsL/MediaLogsCopy";
import { getHourwiseSegregation } from "utilFunctions/LogsL/getHourwiseSegregation";
import { getFilterArrayForDropDown } from "utilFunctions/LogsL/getDynamicFilterArray";

const mapStateToProps = (state) => {
  let act = jwt_decode(state.act.act);
  return {
    outlet: act.outlets[0],
    time: state.time.time,
    companyServices: state.services.companyServices,
    outletTimezone: state.outletCode.outletTimezone,
  };
};

class KOTLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logsData: [],
      logsColumnInfo: [
        {
          dataField: "kot_number",
          text: "KOT Number",
          sort: false,
        },
        {
          dataField: "invoice_number",
          text: "Invoice Number",
          sort: true,
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
        },
        {
          dataField: "restaurant_name",
          text: "Restaurant Name",
          sort: true,
        },
        {
          dataField: "outlet_name",
          text: "Outlet Name",
          sort: true,
        },
        {
          dataField: "delivery_aggregator",
          text: "Delivery Aggregator",
          sort: true,
        },
        {
          dataField: "total_amount",
          text: "Total Amount",
          sort: true,
        },
        {
          dataField: "timestamp",
          text: "Accepted",
          sort: true,
        },
        {
          dataField: "processed",
          text: "Processed",
          sort: true,
        },
        {
          dataField: "dispatched",
          text: "Dispatched",
          sort: true,
        },
        {
          dataField: "media",
          text: "Media",
          sort: false,
        },
      ],
      logsName: "Kitchen Order Ticket",
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
    this._ismounted &&
      axios
        .get(
          nodeBaseURL +
            `kot_pos_data/list/${nextProps.outlet}/${nextProps.time}`,
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("act")}`,
            },
          }
        )
        .then((res) => {
          let x = res.data.map((r) => ({
            kot_number: r.kot_number,
            invoice_number: r.invoice_number,
            status: r.status,
            restaurant_name: r.restaurant_name,
            outlet_name: r.outlet_name,
            delivery_aggregator: r.delivery_aggregator,
            total_amount: r.total_amount,
            timestamp: r.timestamps.accepted,
            processed: r.timestamps.processed,
            dispatched: r.timestamps.dispatched,
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
              daterange: handleDateRange(
                nextProps.time,
                this.props.outletTimezone
              ),
            });
          if (x.length === 0) {
            this._ismounted &&
              this.setState({
                daterange: `No data is available for ${nextProps.time}`,
              });
          }
        })
        .catch((err) => {
          console.log(err);
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
          timeZone: nextProps.companyServices[nextProps.outlet]
            ? nextProps.companyServices[nextProps.outlet].timezone
            : null,
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
        />
      </>
    );
  }
}

export default connect(mapStateToProps)(KOTLogs);
