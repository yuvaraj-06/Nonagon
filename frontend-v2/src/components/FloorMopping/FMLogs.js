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
        outletCameraDetails: state.outletCode.outletCameraDetails,
        outletTimezone: state.outletCode.outletTimezone
    };
}

class FMLogs extends React.Component {
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
                    dataField: "mopping_status",
                    text: "Mopping Status",
                    sort: false,
                },
                {
                    dataField: "media",
                    text: "Mopping Image",
                    sort: false,
                },
            ],
            logsName: 'Floor Mopping',
            outlet: props.outlet,
            time: props.time,
            daterange: "Loading...",
            filterParameter: 'mopping_status',
            dynamicFilterArray: [],
            timeZone: props.companyServices[props.outlet] ? props.companyServices[props.outlet].timezone : null
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        this._ismounted && axios.get(
            nodeBaseURL +
            `mopping/list/${nextProps.outlet}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`
                }
            }
        )
            .then((res) => {
                var x = res.data
                    .map((r) => {
                        return ({
                            timestamp: r.timestamp,
                            camera_location: this.props.outletCameraDetails[r.camera_location],
                            mopping_status: r.mopping_status ? 'Mopped' : 'Not Mopped',
                            media: r.screenshot
                        })
                    })
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
                        useHour12Format={true}
                    />
                </div>
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(FMLogs);