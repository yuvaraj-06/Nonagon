import moment from "moment-timezone";
import getGraphTimeFrame from "utilFunctions/getGraphTimeFrame";

export const getTimeDifferenceinMinutes = (time) => {
    if (time === 'day') {
        var start = moment().startOf('day');
        return Math.abs((new Date() - start) / 60000);
    } else if (time === 'yesterday') {
        return 1440;
    } else if (time === 'week') {
        var a = getGraphTimeFrame(time);
        return Math.abs((a.end - a.start) / (7 * 1440));
    } else if (time === 'month') {
        a = getGraphTimeFrame(time);
        return Math.abs((a.end - a.start) / (30 * 1440));
    }
    return -1;
};

export const getPackagingEfficiency = (jsonData, time) => {
    let { bag_print_true, bag_print_false } = jsonData;
    return (bag_print_false + bag_print_true) / getTimeDifferenceinMinutes(time);
};