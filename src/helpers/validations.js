import { EVENT_STATUSES } from "../constants/app";

export function canUpdateEvent(event) {
  return [EVENT_STATUSES.ongoing.text].includes(event.status);
}

export function canCancelEvent(event) {
  return [EVENT_STATUSES.ongoing.text, EVENT_STATUSES.booked.text].includes(
    event.status
  );
}
