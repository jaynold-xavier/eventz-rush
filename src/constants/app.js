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
    color: "green",
  },
  declined: {
    text: "Declined",
    color: "red",
  },
  paid: {
    text: "Paid",
    color: "black",
  },
};

//#region date constants
export const DISPLAY_DATE_FORMAT = "MMMM DD, YYYY";
//#region

//#region antd props
export const commonPopConfirmProp = {
  okText: "Yes",
  cancelText: "No",
  cancelButtonProps: { style: { float: "right" } },
};
//#region

//#region app policies
export const maxAdvanceBookingPeriod = "30 days";
export const bookingPaymentPeriod = "24 hours";
export const finalPaymentPeriod = "14 days";
//#region
