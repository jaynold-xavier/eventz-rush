import { map } from "lodash";

import { VENDOR_STATUSES, VENDOR_TYPES } from "./app";

export const vendorOptions = map(VENDOR_TYPES, (obj, key) => {
  return {
    label: obj.text,
    value: key,
  };
});

export const vendorStatusOptions = map(VENDOR_STATUSES, (obj, key) => {
  return {
    label: obj.text,
    value: key,
  };
});
