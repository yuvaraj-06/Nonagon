import HygieneIndex from "components/Dashboard/HygieneIndex/HygieneIndex";
import Demographics from "components/Dashboard/Demographics/Demographics";
import PPECheck from "components/Dashboard/PPECheck/PPECheck";
import IPPECheckCard from "components/Dashboard/IPPECheck/IPPECheckCard";
import EntryExit from "components/Dashboard/EntryExit/EntryExit";
import KOT from "components/Dashboard/KOT/KOT";
import BillingUnmanned from "components/BillingUnmanned/BillingUnmannedCard";
import PeopleCount from "components/Dashboard/PeopleCount/PeopleCount";
import Handwash from "components/Dashboard/Handwash/Handwash";
import SocialDistancing from "components/Dashboard/SocialDistancing/SocialDistancing";
import OpenClose from "components/Dashboard/OpenClose/OpenClose";
import OccupancyCard from "components/Dashboard/Occupancy/OccupancyCard";
import ElectricityWastage from "components/ElectricityWastage/EWCard";
import Heatmap from "components/Heatmap/HeatmapCard";
import FLoorMopping from "components/FloorMopping/FMCard";
import PhoneUsage from "components/PhoneUsage/PUCard";
import AgeEstimationCard from "components/Demographics/AgeEstimation/AECard";

// import NotificationsCard from "components/Dashboard/Notifications/Notifications"

import getFlatArray from "utilFunctions/getFlatArray";
import SuspicionCountCard from "components/SuspicionCount/SuspicionCountCard";
import CCTVTampering from "components/CCTVTampering/CCTVTamperingCard";
import EntranceManned from "components/EntranceManned/EntranceMannedCard";
import SecurityPresence from "components/SecurityPresence/SecurityPressenceCard";
import CSICard from "components/CustomerSatisfaction/CSICard";
import CACard from "components/CustomerAttended/CACard";
import BagPrintCard from "components/BagPrint/BagPrintCard";
import PackagingPrintIndexCard from "components/PackagingPrint/PackagingPrintIndexCard";
import PackagingEfficiencyCard from "components/PackagingPrint/PackagingEfficiencyCard";
import DeliveryRateCard from "components/DeliveryRate/DRCard";
import FireAlertCard from "components/FireAlert/FireAlertCard";
import CustomerConversionCard from "components/CustomerConversion/CCCard";
import CustomerTimeInsightsCard from "components/CustomerTimeInsights/CTICard";
import IntrusionDetectionCard from "components/IntrusionDetection/IntrusionDetectionCard";

import ANPRCard from "components/ANPR/ANPRCountCard";

import EmployeePresence from "components/EmployeePresence/EmployeePresenceCard";
import TVSCustomerTimeInsightsCard1 from "components/TVSBK1/CTICard";
import TVSCustomerTimeInsightsCard2 from "components/TVSBK2/CTICard";

const getDashboardCards = (services) => {
  services.sort();
  //hygiene cards
  let hygieneCards = services.map((item) => {
    let component;
    switch (item) {
      case "KHD.HWT":
        component = Handwash;
        break;
      case "KHD.FMM":
        component = FLoorMopping;
        break;
      default:
        break;
    }
    return component;
  });
  // safety cards
  let safetyCards = services.map((item) => {
    var component;
    switch (item) {
      // not mentioned in segregated list
      case "CI.EL":
        component = EntryExit;
        break;
      case "CS.SD":
        component = SocialDistancing;
        break;
      case "EM.EWD":
        component = ElectricityWastage;
        break;
      case "SAD.SD":
        component = SuspicionCountCard;
        break;
      case "TA.CCTV":
        component = CCTVTampering;
        break;
      case "ST.STP":
        component = SecurityPresence;
        break;
      // notmentioned in segregated list
      case "DL.DR":
        component = DeliveryRateCard;
        break;
      case "TA.FIRE":
        component = FireAlertCard;
        break;
      case "SAD.UM":
        component = IntrusionDetectionCard;
        break;
      default:
        break;
    }
    return component;
  });
  // quality cards
  let qualityCards = services.map((item) => {
    let component;
    switch (item) {
      case "CI.AE":
        component = AgeEstimationCard;
        break;
      case "CI.CSI":
        component = CSICard;
        break;
      case "CI.CU":
        component = CACard;
        break;
      case "CI.PC":
        component = PeopleCount;
        break;
      case "SEPM.OCT":
        component = OpenClose;
        break;
      case "OCT.MBC":
        component = BillingUnmanned;
        break;
      case "OCT.KT":
        component = KOT;
        break;
      case "WI.RO":
        component = OccupancyCard;
        break;
      case "CI.GRM":
        component = Demographics;
        break;
      case "CI.SH":
        component = Heatmap;
        break;
      case "SEPM.PU":
        component = PhoneUsage;
        break;
      case "SEPM.SEU":
        component = EntranceManned;
        break;
      case "WI.PC":
        component = BagPrintCard;
        break;
      case "WI.PI":
        component = PackagingPrintIndexCard;
        break;
      case "WI.PE":
        component = PackagingEfficiencyCard;
        break;
      case "CI.CCM":
        component = CustomerConversionCard;
        break;
      case "CI.CTI":
        component = CustomerTimeInsightsCard;
        break;
      case "DL.NP":
        component = ANPRCard;
        break;
      case "SEPM.EP":
        component = EmployeePresence;
        break;
      case "TVS.CTI1":
        component = TVSCustomerTimeInsightsCard1;
        break;
      case "TVS.CTI2":
        component = TVSCustomerTimeInsightsCard2;
        break;
      default:
        break;
    }
    return component;
  });
  // let hardCards = [];
  if (
    services.includes("KPPE.HD") ||
    services.includes("KPPE.FMD") ||
    services.includes("KPPE.GD")
  ) {
    hygieneCards.unshift(PPECheck);
  }
  if (
    services.includes("IPPE.HM") ||
    services.includes("IPPE.VE") ||
    services.includes("IPPE.BO")
  ) {
    qualityCards.unshift(IPPECheckCard);
  }
  if (services.includes("HI.FNB") || services.includes("HI.R")) {
    hygieneCards.unshift(HygieneIndex);
  }
  // let finalCards = hardCards.concat(dynamicCards);
  hygieneCards = hygieneCards.filter((item) => item !== undefined);
  safetyCards = safetyCards.filter((item) => item !== undefined);
  qualityCards = qualityCards.filter((item) => item !== undefined);
  return {
    hygieneCards: getFlatArray(hygieneCards),
    safetyCards: getFlatArray(safetyCards),
    qualityCards: getFlatArray(qualityCards),
  };
};

export default getDashboardCards;
