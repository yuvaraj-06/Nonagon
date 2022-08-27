import moment from 'moment-timezone';

export const getConvertedTime = (timestamp, timezone, format) => {
    var m = moment.utc(timestamp);
    m.tz(timezone);
    // console.log(timestamp, timezone, m.format(format))
    return m.format(format);
};

export const comparisonGraphTimeFormat = 'hh:mm A';
export const hour24TimeFormat = 'HH:mm';
export const ISOFormat = 'YYYY-MM-DDTHH:mm:ssZ';
export const graphDateFormat = 'DD/MM';
export const onlyDateFormat = 'll'  // Jul 14, 2021
export const hour24Format = 'MMMM Do YYYY, HH:mm'
export const hour12Format = 'MMMM Do, hh:mm A' // Mon, Jul 12, 2021 8:00 AM
export const mediaLogsToTimeFormat = 'hh:mm A';