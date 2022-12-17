import { map } from "lodash";

import { VENDOR_TYPES } from "./app";

export const vendorOptions = map(VENDOR_TYPES, (value, key) => {
  return {
    label: value,
    value: key,
  };
});

export const vendorStatusOptions = [
  {
    label: "Available",
    value: "available",
  },
  {
    label: "Unavailable",
    value: "unavailable",
  },
];
