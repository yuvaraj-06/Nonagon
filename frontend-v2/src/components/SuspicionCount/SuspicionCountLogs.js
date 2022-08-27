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
        outletCameraDetails: state.outletCode.outletCameraDetails,
        outletTimezone: state.outletCode.outletTimezone
    };
}

class SuspicionCountLogs extends React.Component {
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
                    dataField: "camera_location",
                    text: "Camera Location",
                    sort: false,
                },
                {
                    dataField: "theft_status",
                    text: "Suspicion Status",
                    sort: false,
                },
                // {
                //     dataField: "suspicion_level",
                //     text: "Suspicion Level",
                //     sort: false,
                // },
                {
                    dataField: "media",
                    text: "Video",
                    sort: false,
                },
            ],
            logsName: 'Suspicion Detection',
            outlet: props.outlet,
            time: props.time,
            daterange: "Loading...",
            filterParameter: 'camera_location',
            dynamicFilterArray: [],
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `theft/list/${nextProps.outlet}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                var x = res.data
                    .map((r) => ({
                        timestamp: r.timestamp,
                        camera_location: this.props.outletCameraDetails[r.camera_location],
                        theft_status: r.theft_status.toString().toUpperCase(),
                        suspicion_level: r.suspicion_level.toString().toUpperCase(),
                        media: r.video
                    }))
                var filterArray = getFilterArrayForDropDown(this.state.filterParameter, x)
                x = getHourwiseSegregation(x, nextProps.time)
                this._ismounted && this.setState({ logsData: x.reverse(), dynamicFilterArray: filterArray, daterange: handleDateRange(nextProps.time, this.props.outletTimezone) });
                if (x.length === 0) {
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
            this._ismounted && this.setState({ daterange: 'Loading...', time: nextProps.time })
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
)(SuspicionCountLogs);
