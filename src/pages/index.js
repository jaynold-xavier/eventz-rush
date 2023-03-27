// error pages
export { PageNotFound, PageNotAuthorized } from "./errors";

// home page
export { default as Home } from "./home/Index";

// vendors pages
export { VendorsList, VendorDetails } from "./vendors";

// faq page
export { default as FAQ } from "./faq/Index";

// privacy page
export { default as Privacy } from "./policy/Index";

// login page
export { default as Login } from "./login/Index";

// register page
export { default as Register } from "./register/Index";

// account pages
export {
  EventCreateWizard,
  EventCreateWizard as EventUpdateWizard,
  HostDashboard,
  HostEventsList,
  VendorDashboard,
  VendorEventsList,
  VendorPhotos,
  VendorProfile,
} from "./account";

export { EventDetails } from "./events";
