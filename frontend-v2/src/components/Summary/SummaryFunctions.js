import { getPackagingEfficiency } from "utilFunctions/PackagingPrint/getPackagingEfficiency";
import { getPrintIndex } from "utilFunctions/PackagingPrint/getPrintIndex";

const errorObject = {
    today: 0,
    yesterday: 0,
    weekAvg: 0,
    msg1: "We are facing some error while displaying this feature.",
    msg2: "We are facing some error while displaying this feature.",
};

const SummaryPeopleCount = (res) => {
    let msg1 = {
        increment:
            "The number of people who visited today is higher than yesterday by ",
        decrement:
            "The number of people who visited today is lower than yesterday by ",
        noChange: "The number of people who visited today is the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, the number of people visiting your outlet is higher than your Weekly Average by ",
        decrement:
            "Looks like the number of people visiting your outlet is lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let datesArr = Object.keys(res.data);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = res.data[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = res.data[datesArr[datesArr.length - 2]];
    }

    let weekAvg = Math.round(
        Object.values(res.data).reduce((a, b) => {
            return a + b;
        }, 0) / 7
    );

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryHygieneIndex = (res) => {
    let msg1 = {
        increment: "Your Outlet's Hygiene Index today is higher than yesterday by ",
        decrement: "Your Outlet's Hygiene Index today is lower than yesterday by ",
        noChange: "Your Outlet's Hygiene Index today is the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, your outlet's Hygiene Index is higher than your Weekly Average by ",
        decrement:
            "Looks like your outlet's Hygien Index is lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let updatedResponse = {};
    for (let i = 0; i < res.data.length; i++) {
        updatedResponse[res.data[i].ts] = res.data[i].hygiene_index;
    }

    let datesArr = Object.keys(updatedResponse);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = updatedResponse[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = updatedResponse[datesArr[datesArr.length - 2]];
    }

    let weekAvg = Math.round(
        Object.values(updatedResponse).reduce((a, b) => {
            return a + b;
        }, 0) / 7
    );

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData.toFixed(2),
        yesterday: yesterdayData.toFixed(2),
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryMopping = (res) => {
    let msg1 = {
        increment:
            "Today the mopping activity seems to be higher than yesterday by ",
        decrement:
            "Today the mopping activity seems to be lower than yesterday by ",
        noChange: "Today the mopping activity seems to be the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, your outlet's mopping activity is higher than your Weekly Average by ",
        decrement:
            "Looks like your outlet's mopping activity is lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let updatedResponse = {};
    let processedData = {};
    for (let i = 0; i < res.data.length; i++) {
        updatedResponse[res.data[i].timestamp] = res.data[i].mopping_status;
    }
    for (let obj in updatedResponse) {
        let y = obj.slice(0, 11) + "00:00:00+00:00";
        processedData[y] = 0;
        for (let x in updatedResponse) {
            if (new Date(obj).getDate() === new Date(x).getDate()) {
                processedData[y] += 1;
            }
        }
    }

    let datesArr = Object.keys(processedData);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = processedData[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = processedData[datesArr[datesArr.length - 2]];
    }

    let weekAvg = Math.round(
        Object.values(processedData).reduce((a, b) => {
            return a + b;
        }, 0) / 7
    );

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryBillingCounter = (res) => {
    let msg1 = {
        increment:
            "The billing counter unmanned instances today are higher than yesterday by ",
        decrement:
            "The billing counter unmanned instances today are lower than yesterday by ",
        noChange:
            "The billing counter unmanned instances today seem to be the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, your outlet's billing counter unmanned instances are lower than your Weekly Average by ",
        decrement:
            "Looks like your 's billing counter unmanned instances are higher than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let updatedResponse = {};
    let processedData = {};
    for (let i = 0; i < res.data.length; i++) {
        updatedResponse[res.data[i].timestamp] = res.data[i].manned_status;
    }
    for (let obj in updatedResponse) {
        let y = obj.slice(0, 11) + "00:00:00+00:00";
        processedData[y] = 0;
        for (let x in updatedResponse) {
            if (new Date(obj).getDate() === new Date(x).getDate()) {
                processedData[y] += 1;
            }
        }
    }

    let datesArr = Object.keys(processedData);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = processedData[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = processedData[datesArr[datesArr.length - 2]];
    }

    let weekAvg = Math.round(
        Object.values(processedData).reduce((a, b) => {
            return a + b;
        }, 0) / 7
    );

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryMaskSOP = (res) => {
    let msg1 = {
        increment:
            "The mask sop deviation instances today are higher than yesterday by ",
        decrement:
            "The mask sop deviation instances today are lower than yesterday by ",
        noChange:
            "The mask sop deviation instances today seem to be the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, your outlet's mask sop deviation instances are lower than your Weekly Average by ",
        decrement:
            "Looks like your outlet's mask sop deviation instances are lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let updatedResponse = {};
    for (let i = 0; i < res.data.length; i++) {
        updatedResponse[res.data[i].ts] = res.data[i].mask;
    }

    let datesArr = Object.keys(updatedResponse);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = updatedResponse[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = updatedResponse[datesArr[datesArr.length - 2]];
    }

    let weekAvg = Math.round(
        Object.values(updatedResponse).reduce((a, b) => {
            return a + b;
        }, 0) / 7
    );

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryDemographicsMale = (res, gender) => {
    let msg1 = {
        increment:
            "Today the number of male customers visiting your outlet is higher than yesterday by ",
        decrement:
            "Today the number of male customers visiting your outlet is lower than yesterday by ",
        noChange:
            "Today the number of male customers visiting your outlet seems to be the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, the number of male customers visiting your outlet is higher than your Weekly Average by ",
        decrement:
            "Looks like the number of male customers visiting your outlet is lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let datesArr = Object.keys(res.data);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = res.data[datesArr[datesArr.length - 1]].male;
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = res.data[datesArr[datesArr.length - 2]].male;
    }

    let weekAvg = 0;
    datesArr.map((date) => {
        weekAvg += res.data[date].male;
        return date
    });
    weekAvg = (weekAvg / 7).toFixed(2);

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryDemographicsFemale = (res, gender) => {
    let msg1 = {
        increment:
            "Today the number of female customers visiting your outlet is higher than yesterday by ",
        decrement:
            "Today the number of female customers visiting your outlet is lower than yesterday by ",
        noChange:
            "Today the number of female customers visiting your outlet seems to be the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, the number of female customers visiting your outlet is higher than your Weekly Average by ",
        decrement:
            "Looks like the number of female customers visiting your outlet is lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let datesArr = Object.keys(res.data);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = res.data[datesArr[datesArr.length - 1]].female;
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = res.data[datesArr[datesArr.length - 2]].female;
    }

    let weekAvg = 0;
    datesArr.map((date) => {
        weekAvg += res.data[date].female;
        return date
    });
    weekAvg = (weekAvg / 7).toFixed(2);

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryPrintCount = (res) => {
    let msg1 = {
        increment:
            "Today the number of bags not printed in your outlet is higher than yesterday by ",
        decrement:
            "Today the number of bags not printed in your outlet is lower than yesterday by ",
        noChange:
            "Today the number of bags not printed in your outlet seems to be the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, the number of bags not printed in your outlet is higher than your Weekly Average by ",
        decrement:
            "Looks like the number of bags not printed in your outlet is lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let updatedResponse = {};
    res.data.forEach((element) => {
        updatedResponse[element.ts] = element.bag_print_true;
    });

    let datesArr = Object.keys(updatedResponse);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = updatedResponse[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = updatedResponse[datesArr[datesArr.length - 2]];
    }

    let weekAvg = Math.round(
        Object.values(updatedResponse).reduce((a, b) => {
            return a + b;
        }, 0) / 7
    );

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryPrintNotCount = (res) => {
    let msg1 = {
        increment:
            "Today the number of bags not printed in your outlet is higher than yesterday by ",
        decrement:
            "Today the number of bags not printed in your outlet is lower than yesterday by ",
        noChange:
            "Today the number of bags not printed in your outlet seems to be the same as yesterday",
    };
    let msg2 = {
        increment:
            "Congratulations! Today, the number of bags not printed in your outlet is higher than your Weekly Average by ",
        decrement:
            "Looks like the number of bags not printed in your outlet is lower than your Weekly Average by ",
        noChange: "There seems to be no change in the data from yesterday",
    };

    let updatedResponse = {};
    res.data.forEach((element) => {
        updatedResponse[element.ts] = element.bag_print_false;
    });

    let datesArr = Object.keys(updatedResponse);
    let todayDate = new Date().getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = updatedResponse[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = updatedResponse[datesArr[datesArr.length - 2]];
    }

    let weekAvg = Math.round(
        Object.values(updatedResponse).reduce((a, b) => {
            return a + b;
        }, 0) / 7
    );

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData,
        yesterday: yesterdayData,
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2,
    };
};

const SummaryPackagingEfficiency = (res, time) => {
    try {
        let msg1 = {
            increment: 'Today the effiency of packing bags in your outlet is higher than yesterday by ',
            decrement: 'Today the effiency of packing bags in your outlet is lower than yesterday by ',
            noChange: 'Today the effiency of packing bags in your outlet seems to be the same as yesterday.'
        };
        let msg2 = {
            increment: 'Congratulations! Today, the effiency of packing bags in your outlet is higher than your Weekly Average by ',
            decrement: 'Looks like the effiency of packing bags in your outlet is lower than your Weekly Average by ',
            noChange: 'There seems to be no change in the data from yesterday'
        };

        res.data.reverse();

        let todayData = getPackagingEfficiency(res.data[1], 'day').toFixed(1);
        let yesterdayData = getPackagingEfficiency(res.data[2], 'yesterday').toFixed(1);
        let weekData = {
            bag_print_false: 0,
            bag_print_true: 0
        };

        res.data.forEach(el => {
            weekData.bag_print_false += el.bag_print_false;
            weekData.bag_print_true += el.bag_print_true;
        });

        let weekAvg = getPackagingEfficiency(weekData, 'week').toFixed(1);

        let msgToDisplay1 = "";
        let msgToDisplay2 = "";


        if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
        else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
        else msgToDisplay1 = msg1.noChange;

        if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
        else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
        else msgToDisplay2 = msg2.noChange;

        return {
            today: todayData,
            yesterday: yesterdayData,
            weekAvg: weekAvg,
            msg1: msgToDisplay1,
            msg2: msgToDisplay2
        };
        // return errorObject;
    } catch (err) {
        return errorObject;
    }
};

const SummaryPrintIndex = (res) => {
    let msg1 = {
        increment: 'Today the number of bags not printed in your outlet is higher than yesterday by ',
        decrement: 'Today the number of bags not printed in your outlet is lower than yesterday by ',
        noChange: 'Today the number of bags not printed in your outlet seems to be the same as yesterday'
    };
    let msg2 = {
        increment: 'Congratulations! Today, the number of bags not printed in your outlet is higher than your Weekly Average by ',
        decrement: 'Looks like the number of bags not printed in your outlet is lower than your Weekly Average by ',
        noChange: 'There seems to be no change in the data from yesterday'
    };

    let updatedResponse = {};
    res.data.forEach(element => {
        updatedResponse[element.ts] = getPrintIndex(element);
    });

    let weekData = {
        bag_print_false: 0,
        bag_print_true: 0
    };

    res.data.forEach(el => {
        weekData.bag_print_false += el.bag_print_false;
        weekData.bag_print_true += el.bag_print_true;
    });

    let weekAvg = getPrintIndex(weekData, 'week').toFixed(1);

    let datesArr = Object.keys(updatedResponse);
    let todayDate = new Date('2021-08-07T00:00:00+00:00').getDate();
    let lastDate = new Date(datesArr[datesArr.length - 1]).getDate();
    let previousDate = new Date(datesArr[datesArr.length - 2]).getDate();

    let todayData = 0;
    let yesterdayData = 0;

    let msgToDisplay1 = "";
    let msgToDisplay2 = "";

    if (todayDate === lastDate) {
        // if today and the last date from the response match then update the data in state
        todayData = updatedResponse[datesArr[datesArr.length - 1]];
    }

    if (todayDate - 1 === previousDate) {
        // if the response has yesterday's data, then update it in the state
        yesterdayData = updatedResponse[datesArr[datesArr.length - 2]];
    }

    // let weekAvg = Math.round(Object.values(updatedResponse).reduce((a, b) => {
    //     return a + b;
    // }, 0) / 7);

    if (todayData > yesterdayData) msgToDisplay1 = msg1.increment;
    else if (todayData < yesterdayData) msgToDisplay1 = msg1.decrement;
    else msgToDisplay1 = msg1.noChange;

    if (todayData > weekAvg) msgToDisplay2 = msg2.increment;
    else if (todayData < weekAvg) msgToDisplay2 = msg2.decrement;
    else msgToDisplay2 = msg2.noChange;

    return {
        today: todayData.toFixed(1),
        yesterday: yesterdayData.toFixed(1),
        weekAvg: weekAvg,
        msg1: msgToDisplay1,
        msg2: msgToDisplay2
    };
};

export {
    SummaryPeopleCount,
    SummaryHygieneIndex,
    SummaryMopping,
    SummaryBillingCounter,
    SummaryMaskSOP,
    SummaryDemographicsMale,
    SummaryDemographicsFemale,
    SummaryPrintCount,
    SummaryPrintNotCount,
    SummaryPackagingEfficiency,
    SummaryPrintIndex
};
