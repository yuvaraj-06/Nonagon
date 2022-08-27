import moment from "moment";
const getGraphTimeFrame = (childData) => {
    var drange;
    if (childData === "month") {
        let start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        let end = new Date(Date.now());

        return {
            start, end
        };
        //drange = 'Data from ' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') + ' to ' + new Date(Date.now()).toLocaleDateString('en-GB')
    } else if (childData === "week") {
        let start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        let end = new Date(Date.now());

        return {
            start, end
        };
        //drange = 'Data from ' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') + ' to ' + new Date(Date.now()).toLocaleDateString('en-GB')
    } else if (childData === "yesterday") {
        let start = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
        let end = new Date(Date.now());

        return {
            start, end
        };
        //drange = 'Data from ' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') + ' to ' + new Date(Date.now()).toLocaleDateString('en-GB')
    } else if (childData === 'day') {
        let start = moment().startOf('day'); // set to 12:00 am today
        let end = moment().endOf('day'); // set to 23:59 pm today
        return {
            start, end
        };
        //drange = 'Data for ' + new Date(Date.now()).toLocaleDateString('en-GB')
    }
    // else {
    //     drange = `Data from ${new Date(this.state.startDate).toLocaleDateString('en-GB')} to ${new Date(this.state.endDate).toLocaleDateString('en-GB')}`
    // }
    return drange;
};

export default getGraphTimeFrame;