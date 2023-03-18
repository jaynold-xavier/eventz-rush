import { map } from "lodash";

import { EVENT_TYPES, EVENT_STATUSES, USER_ROLES, VENDOR_TYPES } from "./app";

export const userRolesOptions = map(USER_ROLES, (obj, key) => {
  return {
    key,
    label: obj.text,
    value: key,
  };
});

export const vendorTypesOptions = map(VENDOR_TYPES, (obj, key) => {
  return {
    key,
    label: obj.text,
    value: key,
  };
});

export const eventTypesOptions = map(EVENT_TYPES, (obj, key) => {
  return {
    label: obj.text,
    value: obj.text,
  };
});

export const eventStatusesOptions = map(EVENT_STATUSES, (obj, key) => {
  return {
    key,
    label: obj.text,
    value: key,
  };
});
