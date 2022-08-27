import { getConvertedTime, onlyDateFormat } from "./getConvertedTime";

const handleDateRange = (childData, timezone) => {
    // console.log(timezone);
    var drange;
    if (childData === "month") {
        drange = 'Data from ' +
            getConvertedTime(
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                timezone,
                onlyDateFormat
            )
            + ' to ' +
            getConvertedTime(
                new Date(Date.now()).toISOString(),
                timezone,
                onlyDateFormat
            )
        new Date(Date.now()).toLocaleDateString('en-GB')
    } else if (childData === "week") {
        drange = 'Data from ' +
            getConvertedTime(
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                timezone,
                onlyDateFormat
            )
            + ' to ' +
            getConvertedTime(
                new Date(Date.now()).toISOString(),
                timezone,
                onlyDateFormat
            )
    } else if (childData === "yesterday") {
        drange = 'Data for ' +
            getConvertedTime(
                new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                timezone,
                onlyDateFormat
            )
        // + ", " + new Date(Date.now()).toLocaleTimeString('en-US', { hour12: true })
    } else if (childData === 'day') {
        drange = 'Data for ' +
            getConvertedTime(
                new Date(Date.now()).toISOString(),
                timezone,
                onlyDateFormat
            ) + ", from 12:00:00 A.M. to " + new Date(Date.now()).toLocaleTimeString('en-US', { hour12: true })
    }
    // else {
    //     drange = `Data from ${new Date(this.state.startDate).toLocaleDateString('en-GB')} to ${new Date(this.state.endDate).toLocaleDateString('en-GB')}`
    // }
    return drange
}

export default handleDateRange