import moment from "moment";

const getGraphTimeStamp = (timestamp, timeInterval) => {
    var m = moment.utc(timestamp);
    // m.tz(timezone);
    if (timeInterval === 'week' || timeInterval === 'month') {
        return m.format('DD/MM')
    }
    else if (timeInterval === 'day' || 'yesterday') {
        return m.format('HH:mm a')
    }
}

export default getGraphTimeStamp;