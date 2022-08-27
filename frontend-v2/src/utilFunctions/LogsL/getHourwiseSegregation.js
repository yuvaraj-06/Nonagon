
const moment = require('moment-timezone');

//get start and end time of the day
export const getDayStart = (time) => {
    return moment.utc(time).startOf('day').format(null);
};

//get the timestamp for today minus the given N days
const getTodayMinusNTimestamp = (n) => {
    const today = moment.utc().startOf('day').format(null);
    const newTime = moment.utc(today).subtract(n, 'day').format(null);
    return newTime;
};

//increase timestamp by 1 hour
export const increaseTimeByNHours = (time, n) => {
    const newTime = moment.utc(time).add(n, 'hour').format(null);
    return newTime;
};

//increase timestamp by n days
const increaseTimeByNDays = (time, n) => {
    const newTime = moment.utc(time).add(n, 'day').format(null);
    return newTime;
};

//list of hour timestamps in a day
export const getTimestampList = (start, interval) => {
    let timestamps = [];
    if (interval === 'day') {
        for (let i = 0; i <= 23; i++) {
            timestamps.push(increaseTimeByNHours(start, i));
        }
    } else if (interval === 'yesterday') {
        start = moment.utc(start).subtract(1, 'day').startOf('day').format(null);
        for (let i = 0; i <= 23; i++) {
            timestamps.push(increaseTimeByNHours(start, i));
        }
    } else if (interval === 'week') {
        for (let i = 0; i <= 6; i++) {
            timestamps.push(increaseTimeByNDays(start, i));
        }
    } else if (interval === 'month') {
        for (let i = 0; i <= 30; i++) {
            timestamps.push(increaseTimeByNDays(start, i));
        }
    }
    return timestamps;
};

export const getHourwiseSegregation = (data, interval) => {
    try {
        if (interval === 'day' || interval === 'yesterday') {
            var timestampList = getTimestampList(getDayStart(), interval);
            return timestampList.map((time) => {
                time = time.split('Z')[0];
                var b = data.filter(d => (d.timestamp.split('.')[0] > time && d.timestamp.split('.')[0] < increaseTimeByNHours(time, 1).split('Z')[0]));
                return {
                    timestamp: time,
                    data: b.reverse()
                };
            });
        } else if (interval === 'week' || interval === 'month') {
            timestampList = getTimestampList(getTodayMinusNTimestamp(interval === 'week' ? 7 : 30), interval);
            return timestampList.map((time) => {
                time = time.split('Z')[0];
                var b = data.filter(d => (d.timestamp.split('.')[0] > time && d.timestamp.split('.')[0] < increaseTimeByNDays(time, 1).split('Z')[0]));
                return {
                    timestamp: time,
                    data: b.reverse()
                };
            });
        } else {
            throw new Error({ error: 'Invalid Interval' });
        }
    } catch (e) {
        console.log(e);
        return getTimestampList(
            interval === 'day' || interval === 'week' ?
                getDayStart()
                :
                getTodayMinusNTimestamp(interval === 'week' ? 7 : 30), interval
        ).map(item => {
            return {
                timestamp: item,
                data: []
            };
        });
    }
};