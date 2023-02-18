import { CheckCircleTwoTone, StopTwoTone } from "@ant-design/icons";

export const USER_ROLES = {
  host: {
    text: "HOST",
  },
  vendor: {
    text: "VENDOR",
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

export const VENDOR_STATUSES = {
  available: {
    text: "Available",
    color: "#24b1c6",
    get icon() {
      return (props) => (
        <CheckCircleTwoTone twoToneColor={this.color} {...props} />
      );
    },
  },
  unavailable: {
    text: "Unavailable",
    color: "#9f9f9f",
    get icon() {
      return (props) => <StopTwoTone twoToneColor={this.color} {...props} />;
    },
  },
};

export const API_DATE_FORMAT = "DDMMYYY[T]HH:mm[Z]";
export const DISPLAY_DATE_FORMAT = "MMMM DD, YYYY";
