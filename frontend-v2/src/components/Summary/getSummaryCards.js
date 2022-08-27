import {
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
} from './SummaryFunctions';

import getFlatArray from "utilFunctions/getFlatArray";
export const getSummaryCards = (services) => {
    services.sort();
    let servicesCards = services.map(item => {
        let card;
        switch (item) {
            case 'CI.PC':
                card = peopleCountSC;
                break;
            case 'HI.FNB':
                card = hygieneIndexSC;
                break;
            case 'HI.R':
                card = hygieneIndexSC;
                break;
            case 'KHD.FMM':
                card = floorMoppingSC;
                break;
            case 'CI.GRM':
                card = [maleDemographicsSC, femaleDemographicsSC];
                break;
            case 'OCT.MBC':
                card = billingCounterSC;
                break;
            case 'KPPE.FMD':
                card = maskDeviationsSC;
                break;
            case 'WI.PC':
                card = [packagingPrintSC, packagingNotPrintSC];
                break;
            case 'WI.PI':
                card = packagingIndexSC;
                break;
            case 'WI.PE':
                card = packagingEfficiencySC;
                break;
            default:
                break;
        }
        return card;
    });
    return getFlatArray(servicesCards);
};

// cards content
const packagingEfficiencySC = {
    featureName: "Packaging Efficiency",
    stateName: "packagingEfficiency",
    path: "bag_print/list",
    funtionName: SummaryPackagingEfficiency,
};

const packagingIndexSC = {
    featureName: 'Package print index',
    stateName: 'packagingIndex',
    path: 'bag_print/list',
    funtionName: SummaryPrintIndex
};

const packagingPrintSC = {
    featureName: "Print Count",
    stateName: "printCount",
    path: "bag_print/list",
    funtionName: SummaryPrintCount,
};

const packagingNotPrintSC = {
    featureName: "Not Print Count",
    stateName: "notPrintCount",
    path: "bag_print/list",
    funtionName: SummaryPrintNotCount,
};

const peopleCountSC = {
    featureName: "People Count",
    stateName: "peoeplCountData",
    path: "customers/list",
    funtionName: SummaryPeopleCount,
};
const hygieneIndexSC = {
    featureName: "Hygiene Index",
    stateName: "hygieneIndexData",
    path: "hygieneIndex/list",
    funtionName: SummaryHygieneIndex,
};
const floorMoppingSC = {
    featureName: "Mopping",
    stateName: "moppingData",
    path: "mopping/list",
    funtionName: SummaryMopping,
};
const maleDemographicsSC = {
    featureName: "Male Demographics",
    stateName: "demographicsMaleData",
    path: "demographics/gender",
    funtionName: SummaryDemographicsMale,
};
const femaleDemographicsSC = {
    featureName: "Female Demographics",
    stateName: "demographicsFemaleData",
    path: "demographics/gender",
    funtionName: SummaryDemographicsFemale,
};
const billingCounterSC = {
    featureName: "Billing Counter",
    stateName: "billingCounterData",
    path: "billing_manned/list",
    funtionName: SummaryBillingCounter,
};
const maskDeviationsSC = {
    featureName: "Mask Deviations",
    stateName: "sopMaskDeviationData",
    path: "sopDeviation/list",
    funtionName: SummaryMaskSOP,
};
