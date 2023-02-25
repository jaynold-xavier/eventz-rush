import { map } from "lodash";

import { USER_ROLES, VENDOR_TYPES } from "./app";

export const userRolesOption = map(USER_ROLES, (obj, key) => {
  return {
    key,
    label: obj.text,
    value: key,
  };
});

export const vendorOptions = map(VENDOR_TYPES, (obj, key) => {
  return {
    key,
    label: obj.text,
    value: key,
  };
});
