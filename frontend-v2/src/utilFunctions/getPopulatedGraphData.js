const addDays = function (timestamp, days) {
  var date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date;
};

const convertHygieneIndexData = (apiResponseData) => {
  let convertedData = {};
  apiResponseData.forEach((el) => {
    convertedData[el.ts] = el.hygiene_index;
  });

  return convertedData;
};

const convertHandWashData = (apiResponseData) => {
  let convertedData = {};
  apiResponseData.forEach((el) => {
    convertedData[el.ts] = el.handwash_true;
  });

  return convertedData;
};

const convertPPEData = (apiResponseData, feature) => {
  let convertedData = {};
  apiResponseData.forEach((el) => {
    convertedData[el.ts] = el[feature];
  });

  return convertedData;
};

const convertCAData = (apiResponseData, dataType) => {
  let convertedData = {};
  apiResponseData.forEach((el) => {
    convertedData[el.timestamp] = el[dataType];
  });

  return convertedData;
};

const convertBagPrintData = (apiResponseData, dataType) => {
  let convertedData = {};
  apiResponseData.forEach((el) => {
    convertedData[el.ts] = el[dataType];
  });

  return convertedData;
};

const convertCCData = (apiResponseData) => {
  let convertedData = {};
  apiResponseData.forEach((el) => {
    convertedData[el.timestamp] = el.customer_conversion_rate;
  });

  return convertedData;
};

const convertCTIData = (apiResponseData, dataType) => {
  let convertedData = {};
  apiResponseData.forEach((el) => {
    convertedData[el.timestamp] = el[dataType];
  });

  return convertedData;
};

const getPopulatedGraphData = (
  requiredDateRange,
  apiResponseData,
  interval
) => {
  let populatedData = {};

  let hourLabels = [
    "00:00:00",
    "01:00:00",
    "02:00:00",
    "03:00:00",
    "04:00:00",
    "05:00:00",
    "06:00:00",
    "07:00:00",
    "08:00:00",
    "09:00:00",
    "10:00:00",
    "11:00:00",
    "12:00:00",
    "13:00:00",
    "14:00:00",
    "15:00:00",
    "16:00:00",
    "17:00:00",
    "18:00:00",
    "19:00:00",
    "20:00:00",
    "21:00:00",
    "22:00:00",
    "23:00:00",
  ].map((item) => {
    let a = new Date(Date.now()).toISOString().split("T");
    a[1] = item + ".00Z";
    a = a.join("T");
    return a;
  });

  if (interval === 'yesterday') {
    hourLabels = hourLabels.map(item => {
      let currentDate = new Date(item);
      currentDate.setDate(currentDate.getDate() - 1);
      let isoString = currentDate.toISOString();
      isoString = isoString.split(':')[0] + ':00:00.00Z';
      return isoString;
    });
  }

  let convertedResponse = {};
  for (let x in apiResponseData) {
    convertedResponse[x.split(':')[0] + ':00:00.00Z'] = apiResponseData[x];
  }

  if (interval === "day" || interval === "yesterday") {
    for (var i = 0; i < 24; i++) {
      if (convertedResponse[hourLabels[i]]) {
        populatedData[hourLabels[i]] = convertedResponse[hourLabels[i]];
      } else {
        populatedData[hourLabels[i]] = 0;
      }
    }
  } else if (interval === "week" || interval === "month") {
    let newResponseFormat = {};

    for (let x in apiResponseData) {
      newResponseFormat[x.split("T")[0]] = apiResponseData[x];
    }
    let requiredRange =
      (requiredDateRange.end - requiredDateRange.start) / 24 / 60 / 60 / 1000;

    Object.keys(apiResponseData);

    for (i = 0; i < requiredRange; i++) {
      let currentDate = addDays(requiredDateRange.start, i + 1);

      if (newResponseFormat[currentDate.toISOString().split("T")[0]]) {
        populatedData[[currentDate.toISOString()]] =
          newResponseFormat[currentDate.toISOString().split("T")[0]];
      } else {
        populatedData[[currentDate.toISOString()]] = 0;
      }
    }
  } else {
    console.warn("Wrong function prarmeter bitch");
  }
  return populatedData;
};

export default getPopulatedGraphData;
export {
  convertHygieneIndexData,
  convertHandWashData,
  convertPPEData,
  convertCAData,
  convertBagPrintData,
  convertCCData,
  convertCTIData,
};
