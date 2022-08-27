import React from "react";
import ComponentLogs from 'components/LogsL/ComponentLogs'

import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";
import jwt_decode from "jwt-decode";

import handleDateRange from "utilFunctions/handleDateRange";
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    let act = jwt_decode(state.act.act)
    return {
        outlet: state.outletCode.outletCode,
        time: state.time.time,
        outletTimezone: state.outletCode.outletTimezone
    };
}

class CustomerProfilingLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logsData: [],
            logsColumnInfo: [
                {
                    dataField: "date",
                    text: "Date",
                    sort: true,
                },
                {
                    dataField: "timestamp",
                    text: "Time",
                    sort: true,
                },
                {
                    dataField: "totalPeopleCount",
                    text: "Total Count",
                    sort: true,
                },
            ],
            logsName: 'Customer Profiling',
            outlet: props.outlet,
            time: props.time,
            daterange: "Loading...",
        };
    }

    fetchData = (nextProps) => {
        axios.get(
            nodeBaseURL +
            `customercount/list/${nextProps.outlet}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                var x = res.data
                    .slice(0)
                    .reverse()
                    .map((r) => ({
                        date: new Date(r.entryTime).toLocaleDateString("en-GB"),
                        timestamp: new Date(r.entryTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        totalPeopleCount: r.totalPeopleCount,
                    }))
                this._ismounted && this.setState({ logsData: x, daterange: handleDateRange(nextProps.time, this.props.outletTimezone) });
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
            this.fetchData(nextProps);
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <>
                <ComponentLogs
                    logsData={this.state.logsData}
                    logsColumnInfo={this.state.logsColumnInfo}
                    logsName={this.state.logsName}
                    daterange={this.state.daterange}
                />
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(CustomerProfilingLogs);