import { get } from "lodash";

export function getDisplayName(user) {
  return get(user, "title") || get(user, "userName") || "User";
}
