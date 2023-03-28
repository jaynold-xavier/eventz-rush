import { get } from "lodash";
import { USER_ROLES } from "../constants/app";

export function getDisplayName(user) {
  return get(user, "title") || get(user, "userName") || "User";
}

export function getUserRole(user) {
  const type = get(user, "type");
  if (type === USER_ROLES.host.key) {
    return USER_ROLES.host.key;
  } else {
    return USER_ROLES.vendor.key;
  }
}
