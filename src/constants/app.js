export const USER_ROLES = {
  host: {
    text: "Host",
  },
  vendor: {
    text: "Vendor",
  },
};

export const VENDOR_TYPES = {
  mc: {
    text: "MC",
  },
  musicians: {
    text: "Musicians",
  },
  media: {
    text: "Media",
  },
  caterers: {
    text: "Caterers",
  },
  venueProviders: {
    text: "Venue Providers",
  },
  bakery: {
    text: "Bakery",
  },
};

export const EVENT_TYPES = {
  birthday: {
    text: "Birthday",
  },
  christening: {
    text: "Christening",
  },
  conference: {
    text: "Conference",
  },
  charity: {
    text: "Charity",
  },
  companyParty: {
    text: "Company Party",
  },
  christmasParty: {
    text: "Christmas Party",
  },
  engagement: {
    text: "Engagement",
  },
  fashionShow: {
    text: "Fashion Show",
  },
  prom: {
    text: "Prom",
  },
  tradeShow: {
    text: "Trade Show",
  },
  wedding: {
    text: "Wedding",
  },
};

export const EVENT_STATUSES = {
  ongoing: {
    text: "Ongoing",
    color: "cyan",
  },
  booked: {
    text: "Booked",
    color: "orange",
  },
  closed: {
    text: "Closed",
    color: "black",
  },
  cancelled: {
    text: "Cancelled",
    color: "grey",
  },
};

export const INVITE_STATUSES = {
  pending: {
    text: "Pending",
    color: "orange",
  },
  accepted: {
    text: "Accepted",
    color: "lime",
  },
  declined: {
    text: "Declined",
    color: "#f44336",
  },
  paid: {
    text: "Paid",
    color: "black",
  },
};

export const EVENT_WIZARD_STEPS = [
  {
    key: "basic",
    text: "Basic Info",
  },
  {
    key: "selectVendors",
    text: "Select Vendors",
  },
  {
    key: "payment",
    text: "Payment",
  },
];

export const PAYMENT_CATEGORIES = {
  booking: {
    key: "booking",
    text: "Booking Payment",
  },
  final: {
    key: "final",
    text: "Final Payment",
  },
};

//#region date constants
export const DATE_DISPLAY_FORMAT = "DD MMM YYYY";
export const TIME_DISPLAY_FORMAT = "hh:mm A";
export const DATETIME_DISPLAY_FORMAT = "MMMM DD, YYYY hh:mm A";
export const FULL_DATETIME_DISPLAY_FORMAT = "MMMM DD, YYYY hh:mm A";
//#region

//#region antd props
export const commonPopConfirmProp = {
  okText: "Yes",
  cancelText: "No",
  cancelButtonProps: { style: { float: "right" } },
};
//#region

//#region app policies
export const MAX_ADV_BOOKING_PERIOD = "30 days";
export const BOOKING_PAYMENT_PERIOD = "2 days";
export const FINAL_PAYMENT_PERIOD = "14 days";
//#region
