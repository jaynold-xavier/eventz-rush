import { get } from "lodash";

export function getDisplayName(user) {
  return get(user, "displayName") || get(user, "userName") || "User";
}
