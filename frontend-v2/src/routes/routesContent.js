import Dashboard from "views/pages/dashboards/Dashboard.js";
import Handwash from "views/pages/dashboards/Handwash.js";
import SocialDistancing from "views/pages/dashboards/SocialDistancing.js";
import PPECheck from "views/pages/dashboards/PPECheck.js";
import EntryExit from "views/pages/dashboards/EntryExit.js";
import BillingUnmaned from "views/pages/dashboards/BillingUnmanedTab";
import KOT from "views/pages/dashboards/KOT.js";
import Demographics from "views/pages/dashboards/Demographics.js";
import CustomSop from "views/pages/dashboards/CustomSop.js";
import Orders from "views/pages/dashboards/Orders.js";
import Onboarding from "views/pages/dashboards/Onboarding.js";
import Support from "views/pages/dashboards/Support.js";
import Tasks from "views/pages/dashboards/Tasks.js";
import CustomerProfiling from "views/pages/dashboards/CustomerProfiling.js";
import PeopleCount from "views/pages/dashboards/PeopleCount.js";
import EmpAttendace from "views/pages/dashboards/EmpAttendance.js";
import Occupancy from "views/pages/dashboards/OccupancyTab";
import OutletNotifications from "views/pages/dashboards/OutletNotifications.js";
import HeatMap from "views/pages/dashboards/HeatMap.js";
import HygieneIndex from "views/pages/dashboards/HygieneIndex.js";
import ElectricityWastage from "views/pages/dashboards/ElectricityWastageTab";
import SuspicionCount from "views/pages/dashboards/SuspicionCountTab";
import FloorMopping from "views/pages/dashboards/FloorMoppingTab";
import PhoneUsage from "views/pages/dashboards/PhoneUsageTab";
import Highlights from "views/pages/dashboards/Highlights";
import SecurityPresence from "views/pages/dashboards/SecurityPresenceTab";
import CCTVTampering from "views/pages/dashboards/CCTVTamperingTab";
import EntranceManned from "views/pages/dashboards/EnteranceMannedTab";
import ExploreMoreFeatures from "views/pages/dashboards/ExploreMoreFeaturesTab";
import Summary from "views/pages/dashboards/SummaryTab";
import CSI from "views/pages/dashboards/CSITab";
import CustomerAttended from "views/pages/dashboards/CustomerAttended";
import PrintCountTab from "views/pages/dashboards/BagPrintTab";
import CustomerConversion from "views/pages/dashboards/CustomerConversionTab";
import DeliveryRate from "views/pages/dashboards/DeliveryRateTab";
import CustomerTimeInsights from "views/pages/dashboards/CustomerTimeInsights";
import VideoPlayback from "views/pages/dashboards/VideoPlaybackTab";
import Profile from "views/pages/dashboards/ProfileTab";
import FireAlert from "views/pages/dashboards/FireAlertTab";
import IntrusionDetection from "views/pages/dashboards/IntrusionDetectionTab";
import IPPECheck from "views/pages/dashboards/IPPECheckTab";
import ANPRTab from "views/pages/dashboards/ANPR";
import EmployeePresenceTab from "views/pages/dashboards/EmployeePresenceTab";
import TVSCustomerTimeInsightsTab1 from "views/pages/dashboards/TVSCustomerTimeInsights1";
import TVSCustomerTimeInsightsTab2 from "views/pages/dashboards/TVSCustomerTimeInsights2";

//sidebar components JSON

export const HeatMapTab = {
  path: "/heatmap",
  // path: "/dashboard",
  name: "Heatmap",
  icon: "fas fa-map-signs text-primary",
  component: HeatMap,
  layout: "/admin",
};
export const DeliveryRateTab = {
  path: "/delivery-rate",
  // path: "/dashboard",
  name: "Delivery Rate",
  icon: "fas fa-truck text-primary",
  component: DeliveryRate,
  layout: "/admin",
};

export const ElectricityWastageTab = {
  path: "/electricity-wastage",
  // path: "/dashboard",
  name: "Electricity Wastage",
  icon: "fas fa-charging-station text-primary",
  component: ElectricityWastage,
  layout: "/admin",
};

export const SuspicionCountTab = {
  path: "/suspicion-detection",
  // path: "/dashboard",
  name: "Suspicion Detection",
  icon: "fas fa-exclamation-triangle text-primary",
  component: SuspicionCount,
  layout: "/admin",
};

export const FloorMoppingTab = {
  path: "/floor-moppping",
  // path: "/dashboard",
  name: "Floor Mopping",
  icon: "fas fa-broom text-primary",
  component: FloorMopping,
  layout: "/admin",
};

export const PhoneUsageTab = {
  path: "/phone-usage",
  // path: "/dashboard",
  name: "Phone Usage",
  icon: "fas fa-mobile-alt text-primary",
  component: PhoneUsage,
  layout: "/admin",
};

export const DashboardTab = {
  path: "/dashboard",
  name: "Dashboard",
  icon: "fas fa-home text-primary",
  component: Dashboard,
  layout: "/admin",
};

export const SupportTab = {
  path: "/support",
  name: "Support",
  icon: "ni ni-chat-round text-primary",
  component: Support,
  layout: "/admin",
};

export const PPECheckTab = {
  path: "/ppe-deviation",
  // path: "/dashboard",
  name: "PPE Deviation",
  icon: "ni ni-check-bold text-primary",
  component: PPECheck,
  layout: "/admin",
};

export const DemographicsTab = {
  path: "/demographics",
  // path: "/dashboard",
  name: "Demographics",
  icon: "fas fa-venus-mars text-primary",
  component: Demographics,
  layout: "/admin",
};

export const OccupancyTab = {
  path: "/room-occupancy",
  // path: "/dashboard",
  name: "Room Occupancy",
  icon: "fas fa-arrow-circle-up text-primary",
  component: Occupancy,
  layout: "/admin",
};

export const HygieneIndexTab = {
  path: "/hygiene-index",
  // path: "/dashboard",
  name: "Hygiene Index",
  icon: "fas fa-hand-sparkles text-primary",
  component: HygieneIndex,
  layout: "/admin",
};

export const SocialDistancingTab = {
  path: "/social-distancing",
  // path: "/dashboard",
  name: "Social Distancing",
  icon: "fas fa-people-arrows text-primary",
  component: SocialDistancing,
  layout: "/admin",
};

export const PeopleCounterTab = {
  path: "/people-counter",
  // path: "/dashboard",
  name: "People Counter",
  icon: "fas fa-user-friends text-primary",
  component: PeopleCount,
  layout: "/admin",
};

export const KOTTab = {
  path: "/kot",
  // path: "/dashboard",
  name: "Kitchen Order Ticket",
  icon: "fas fa-ticket-alt text-primary",
  component: KOT,
  layout: "/admin",
};

export const EmployeeAttendanceTab = {
  path: "/employee-attendance",
  // path: "/dashboard",
  name: "Employee Attendance",
  icon: "ni ni-bullet-list-67 text-primary",
  component: EmpAttendace,
  layout: "/admin",
};

export const TasksTab = {
  path: "/tasks",
  // path: "/dashboard",
  name: "Tasks",
  icon: "ni ni-bullet-list-67 text-primary",
  component: Tasks,
  layout: "/admin",
};

export const CustomSOPTab = {
  path: "/custom-sop",
  // path: "/dashboard",
  name: "Custom SOP",
  icon: "ni ni-cloud-upload-96 text-primary",
  component: CustomSop,
  layout: "/admin",
};

export const OrdersTab = {
  path: "/orders",
  // path: "/dashboard",
  name: "Orders",
  icon: "ni ni-cart text-primary",
  component: Orders,
  layout: "/admin",
};

export const OnboardingTab = {
  path: "/onboarding",
  // path: "/dashboard",
  name: "Onboard User",
  icon: "ni ni-fat-add text-primary",
  component: Onboarding,
  layout: "/admin",
};

export const CustomerProfilingTab = {
  path: "/customer-profiling",
  // path: "/dashboard",
  name: "Customer Profiling",
  icon: "fas fa-users text-primary",
  component: CustomerProfiling,
  layout: "/admin",
};

export const OutletNotificationsTab = {
  path: "/outlet-notifications",
  // path: "/dashboard",
  name: "Outlet Notifications",
  icon: "fas fa-bell text-primary",
  component: OutletNotifications,
  layout: "/admin",
};

export const HandwashTab = {
  path: "/handwash",
  // path: "/dashboard",
  name: "Handwash",
  icon: "fas fa-hands-wash text-primary",
  component: Handwash,
  layout: "/admin",
};

export const EntryExitTab = {
  path: "/entry-logs",
  // path: "/dashboard",
  name: "Entry Logs",
  icon: "fas fa-door-open text-primary",
  component: EntryExit,
  layout: "/admin",
};

export const BillingUnmanedTab = {
  path: "/billing-counter",
  // path: "/dashboard",
  name: "Billing Counter Unmanned",
  icon: "fas fa-male text-primary",
  component: BillingUnmaned,
  layout: "/admin",
};

export const HighlightsTab = {
  path: "/highlights",
  // path: "/dashboard",
  name: "Your Highlights",
  icon: "fas fa-medal text-primary",
  component: Highlights,
  layout: "/admin",
};

export const SecurityPresenceTab = {
  path: "/security-presence",
  // path: "/dashboard",
  name: "Security Presence",
  icon: "fas fa-user-shield text-primary",
  component: SecurityPresence,
  layout: "/admin",
};

export const CCTVTamperingTab = {
  path: "/cctv-tampering",
  // path: "/dashboard",
  name: "CCTV Tampering",
  icon: "fas fa-exclamation text-primary",
  component: CCTVTampering,
  layout: "/admin",
};

export const EntranceMannedTab = {
  path: "/enterance-manned",
  // path: "/dashboard",
  name: "Entrance Manned",
  icon: "fas fa-shield-alt text-primary",
  component: EntranceManned,
  layout: "/admin",
};

export const ExploreMoreFeaturesTab = {
  path: "/explore-more-features",
  // path: "/dashboard",
  name: "Explore More Features",
  icon: "fas fa-search text-primary",
  component: ExploreMoreFeatures,
  layout: "/admin",
};

export const SummaryTab = {
  path: "/summary",
  name: "Summary",
  icon: "fas fa-clipboard text-primary",
  component: Summary,
  layout: "/admin",
};

export const CSITab = {
  path: "/customer-emotions",
  name: "Customer Emotions",
  icon: "fas fa-smile text-primary",
  component: CSI,
  layout: "/admin",
};

export const CATab = {
  path: "/customers-unattended",
  name: "Customers Unattended",
  icon: "fas fa-id-badge text-primary",
  component: CustomerAttended,
  layout: "/admin",
};

export const PCTab = {
  path: "/bags-print-count",
  name: "Packaging Print",
  icon: "fas fa-shopping-bag text-primary",
  component: PrintCountTab,
  layout: "/admin",
};

export const CustomerConversionTab = {
  path: "/customer-conversion",
  name: "Customer Conversion",
  icon: "fas fa-file-invoice text-primary",
  component: CustomerConversion,
  layout: "/admin",
};

export const CustomerTimeInsightsTab = {
  path: "/customer-time-insights",
  name: "Customer Time Insights",
  icon: "fas fa-user-clock text-primary",
  component: CustomerTimeInsights,
  layout: "/admin",
};

export const VideoPlaybackTab = {
  path: "/benchmarking-tool",
  name: "Benchmarking Tool",
  icon: "fas fa-video text-primary",
  component: VideoPlayback,
  layout: "/admin",
};
export const ProfileTab = {
  path: "/profile",
  // path: "/dashboard",
  name: "Profile",
  icon: "fas fa-user-circle text-primary",
  component: Profile,
  layout: "/admin",
};
export const FireAlertTab = {
  path: "/fire-alert",
  // path: "/dashboard",
  name: "Fire Alert",
  icon: "fas fa-fire-extinguisher text-primary",
  component: FireAlert,
  layout: "/admin",
};
export const IntrusionDetectionTab = {
  path: "/intrusion",
  // path: "/dashboard",
  name: "Intrusion Detection",
  icon: "fas fa-walking text-primary",
  component: IntrusionDetection,
  layout: "/admin",
};
export const IPPECheckTab = {
  path: "/ippe",
  // path: "/dashboard",
  name: "IPPE Check",
  icon: "ni ni-check-bold text-primary",
  component: IPPECheck,
  layout: "/admin",
};

export const ANPRCountTab = {
  path: "/anpr",
  // path: "/dashboard",
  name: "Number Plates",
  icon: "ni fa fa-truck text-primary",
  component: ANPRTab,
  layout: "/admin",
};

export const EmployeePresenceMonitoringTab = {
  path: "/employee-presence",
  name: "Employee Presence Monitoring", 
  icon: "fas fa-male text-primary",
  component: EmployeePresenceTab,
  layout: "/admin",
};

export const TVSCTITab1 = {
  path: "/bikes-insights",
  name: "Bikes Time Insights",
  icon: "fas fa-motorcycle text-primary",
  component: TVSCustomerTimeInsightsTab1,
  layout: "/admin",
};

export const TVSCTITab2 = {
  path: "/region-insights",
  name: "Customer Time Insights - Regions",
  icon: "fas fa-user-clock text-primary",
  component: TVSCustomerTimeInsightsTab2,
  layout: "/admin",
};
