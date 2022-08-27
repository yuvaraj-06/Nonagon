import moment from 'moment-timezone'
// import jwt_decode from 'jwt-decode'

export const getOutletTime = (timestamp, timezone) => {
    var m = moment.utc(timestamp);
    m.tz(timezone);
    var cst = m.format("llll");
    return cst
}