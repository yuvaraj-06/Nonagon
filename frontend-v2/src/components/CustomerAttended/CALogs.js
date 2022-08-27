import React from "react";
import MediaLogs from 'components/LogsL/MediaLogsCopy';

import axios from "axios";
import { nodeBaseURL } from "../../ApiURL";

import handleDateRange from "utilFunctions/handleDateRange";
import { connect } from 'react-redux';
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

class CALogs extends React.Component {
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
                    dataField: "camera_location",
                    text: "Camera Location",
                    sort: false,
                },
                {
                    dataField: "no_customers",
                    text: "No. of Customers",
                    sort: false,
                },
                {
                    dataField: "no_employees",
                    text: "No. of Employees",
                    sort: false,
                },
                // {
                //     dataField: "duration",
                //     text: "Duration (in sec)",
                //     sort: false,
                // },
                {
                    dataField: "media",
                    text: "Media",
                    sort: false,
                },
            ],
            logsName: 'Customers Unattended',
            outlet: props.outlet,
            time: props.time,
            daterange: "Loading...",
            filterParameter: 'camera_location',
            dynamicFilterArray: [],
            timeZone: props.companyServices[props.outlet] ? props.companyServices[props.outlet].timezone : null
        };
        this._ismounted = true;
    }

    fetchData = (nextProps) => {
        axios.get(
            nodeBaseURL +
            `customers_attended/logs/${nextProps.outlet}/${nextProps.time}`,
            {
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('act')}`

                }
            }
        )
            .then(res => {
                let x = res.data.map((el) => {
                    return {
                        timestamp: el.timestamp,
                        attended: el.attended,
                        camera_location: this.props.outletCameraDetails[el.camera_location],
                        no_customers: el.no_customers,
                        no_employees: el.no_employees,
                        // duration: el.duration,
                        media: el.screenshot
                    };
                });
                var filterArray = getFilterArrayForDropDown(this.state.filterParameter, x)
                x = getHourwiseSegregation(x, nextProps.time)
                this._ismounted && this.setState({ logsData: x.reverse(), dynamicFilterArray: filterArray, daterange: handleDateRange(nextProps.time, nextProps.outletTimezone) });
                if (x.length === 0) {
                    this._ismounted && this.setState({
                        daterange: `No data is available for ${nextProps.time}`
                    });
                }
            })
            .catch(err => {
                this._ismounted && this.setState({ daterange: "Some Error Occured Please contact us at support@nonagon.xyz" });
            });
    };

    componentDidMount() {
        this.fetchData(this.state);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this._ismounted && this.setState({ daterange: 'Loading...', })
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
                    useHour12Format={true}
                />
            </>
        );
    }
}

export default connect(
    mapStateToProps,
)(CALogs);