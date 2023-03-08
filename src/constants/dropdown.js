import { map } from "lodash";

import { EVENT_TYPES, USER_ROLES, VENDOR_TYPES } from "./app";

export const userRolesOptions = map(USER_ROLES, (obj, key) => {
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

export const eventTypesOptions = map(EVENT_TYPES, (obj, key) => {
  return {
    key,
    label: obj.text,
    value: key,
  };
});
