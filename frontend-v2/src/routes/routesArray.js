import {
  DashboardTab,
  PeopleCounterTab,
  DemographicsTab,
  SupportTab,
  KOTTab,
  EntryExitTab,
  SocialDistancingTab,
  HandwashTab,
  BillingUnmanedTab,
  PPECheckTab,
  OccupancyTab,
  HeatMapTab,
  // OnboardingTab,
  HygieneIndexTab,
  ElectricityWastageTab,
  OutletNotificationsTab,
  // TheftTab,
  FloorMoppingTab,
  PhoneUsageTab,
  HighlightsTab,
  EntranceMannedTab,
  SecurityPresenceTab,
  CCTVTamperingTab,
  SuspicionCountTab,
  SummaryTab,
  CSITab,
  CATab,
  PCTab,
  CustomerConversionTab,
  ExploreMoreFeaturesTab,
  DeliveryRateTab,
  CustomerTimeInsightsTab,
  VideoPlaybackTab,
  ProfileTab,
  FireAlertTab,
  IntrusionDetectionTab,
  IPPECheckTab,
  ANPRCountTab,
  EmployeePresenceMonitoringTab,
  TVSCTITab1,
  TVSCTITab2,
} from "./routesContent";
import getFlatArray from "utilFunctions/getFlatArray";
// import jwt_decode from 'jwt-decode'

let tempAct;
if (!localStorage.getItem("act")) {
  tempAct =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vdjJAb3VyZXllLmFpIiwiZW1haWwiOiJkZW1vdjJAb3VyZXllLmFpIiwibmFtZSI6IkRlbW8gdjIgVXNlciIsImNvbXBhbnkiOiJYWVowMDAxIiwib3V0bGV0IjoiWFlaMDAwMS1TMDAwMyIsInRpbWV6b25lIjoiQXNpYS9TaW5nYXBvcmUiLCJvdXRsZXRzIjpbIlhZWjAwMDEtUzAwMDMiLCJYWVowMDAxLVMwMDAxIl0sInBvc2l0aW9uIjoiQWRtaW4iLCJyb2xlIjoib3BlcmF0b3IiLCJpbml0aWFsX2xvZ2luIjpmYWxzZSwic2VydmljZXMiOlsiQ0kuUEMiLCJTQUQuU0QiLCJTRVBNLlBVIiwiRU0uRVdEIiwiS0hELkZNTSIsIkNJLkFFIiwiQ0kuRUwiLCJDSS5TSCIsIkNJLkdSTSIsIlNFUE0uT0NUIiwiU1QuU1RQIiwiQ1MuU0QiLCJDUy5NRCIsIk9DVC5LVCIsIkhJLkZOQiIsIktIRC5IV1QiLCJLUFBFLkhEIiwiS1BQRS5GTUQiLCJLUFBFLkdEIiwiV0kuUk8iXSwicnRtcF9saW5rIjoicnRtcDovLzE2NC41Mi4yMDYuMzEvIiwibWV0YSI6eyJjYW1fMSI6IkNJLlBDLCBDSS5FTCwgS1BQRS5IRCIsImNhbV8yIjoiQ0kuU0gsIENJLkdSTSwgIiwiY2FtXzMiOiJLUFBFLkZNRCwgS1BQRS5HRCJ9LCJleHAiOjE2MjQ2NDIxNzZ9.KGKeZi5q7_58Trg-Zwh2zUFxXWIovo7aa_0kXCGZeNw";
  document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";
  localStorage.setItem("act", tempAct);
}

const dashboardRoutes = [
  DashboardTab,
  ProfileTab,
  HighlightsTab,
  SummaryTab,
  ExploreMoreFeaturesTab,
];
const supportRoutes = [OutletNotificationsTab, SupportTab];

export const getRoutesArray = (services) => {
  services.sort();
  let actualRoutes = services.map((item) => {
    let component;
    switch (item) {
      case "CI.CSI":
        component = CSITab;
        break;
      case "CI.CU":
        component = CATab;
        break;
      case "CI.PC":
        component = PeopleCounterTab;
        break;
      case "CI.EL":
        component = EntryExitTab;
        break;
      case "CI.SH":
        component = HeatMapTab;
        break;
      case "SAD.SD":
        component = SuspicionCountTab;
        break;
      case "OCT.MBC":
        component = BillingUnmanedTab;
        break;
      case "CS.SD":
        component = SocialDistancingTab;
        break;
      case "OCT.KT":
        component = KOTTab;
        break;
      case "WI.RO":
        component = OccupancyTab;
        break;
      case "KHD.HWT":
        component = HandwashTab;
        break;
      case "CI.GRM":
        component = DemographicsTab;
        break;
      case "EM.EWD":
        component = ElectricityWastageTab;
        break;
      case "KHD.FMM":
        component = FloorMoppingTab;
        break;
      case "SEPM.PU":
        component = PhoneUsageTab;
        break;
      case "TA.CCTV":
        component = CCTVTamperingTab;
        break;
      case "SEPM.SEU":
        component = EntranceMannedTab;
        break;
      case "ST.STP":
        component = SecurityPresenceTab;
        break;
      case "HI.FNB":
        component = HygieneIndexTab;
        break;
      case "HI.R":
        component = HygieneIndexTab;
        break;
      case "KPPE.FMD":
        component = PPECheckTab;
        break;
      case "WI.PC":
        component = PCTab;
        break;
      case "CI.CCM":
        component = CustomerConversionTab;
        break;
      case "CI.CTI":
        component = CustomerTimeInsightsTab;
        break;
      case "DL.DR":
        component = DeliveryRateTab;
        break;
      case "CS.BT":
        component = VideoPlaybackTab;
        break;
      case "TA.FIRE":
        component = FireAlertTab;
        break;
      case "SAD.UM":
        component = IntrusionDetectionTab;
        break;
      case "IPPE.HM":
        component = IPPECheckTab;
        break;
      case "DL.NP":
        component = ANPRCountTab;
        break;
      case "SEPM.EP":
        component = EmployeePresenceMonitoringTab;
        break;
      case "TVS.CTI1":
        component = TVSCTITab1;
        break;
      case "TVS.CTI2":
        component = TVSCTITab2;
        break;
      default:
        break;
    }
    return component;
  });
  // if ((services.includes('KPPE.HD') || services.includes('KPPE.FMD') || services.includes('KPPE.GD')) && !dashboardRoutes.includes(PPECheckTab)) {
  //     dashboardRoutes.push(PPECheckTab)
  // }
  actualRoutes = dashboardRoutes.concat(actualRoutes).concat(supportRoutes);

  return getFlatArray(actualRoutes);
};
