import { analytics, auth, db } from "../assets/js/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { get, isEmpty, map } from "lodash";
import { INVITE_STATUSES, USER_ROLES } from "../constants/app";
import { isDateInRange } from "../helpers/timestamp";
import { logEvent } from "firebase/analytics";

//#region helpers
export async function getRecords(table, constraints = []) {
  const ref = collection(db, table);
  const q = query(ref, ...constraints);

  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push({
      id: doc.id,
      record: doc.data(),
    });
  });

  return data;
}
//#region

//#region users
export async function getUser(id) {
  if (!id) {
    const loggedInUser = await auth.currentUser;
    id = get(loggedInUser, "email");
  }

  const types = ["hosts", "vendors"];

  for (let i = 0; i < types.length; i++) {
    const table = types[i];
    const ref = doc(db, table, id);
    let user = await getDoc(ref);
    user = user.data();
    if (user && !isEmpty(user)) {
      return user;
    }
  }
}

export async function addUser(data, type) {
  if (isEmpty(data)) {
    data = await auth.currentUser;
  }

  let collection;
  if (type === "host") {
    collection = "hosts";
  } else {
    collection = "vendors";
  }

  const ref = doc(db, collection, data.email);
  await setDoc(ref, data, { merge: true });
}

export async function updateVendor(id, data) {
  const ref = doc(db, "vendors", id);
  await updateDoc(ref, data);
}

export async function updateHost(id, data) {
  const ref = doc(db, "hosts", id);
  await updateDoc(ref, data);
}
//#region

//#region events
export async function createEvent(data) {
  const eventData = await addDoc(collection(db, "events"), data);
  return eventData.id;
}

export async function updateEvent(id, data) {
  const ref = doc(db, "events", id);
  await updateDoc(ref, data);
}

export async function getEvent(id) {
  if (!id) return null;

  const ref = doc(db, "events", id);
  const event = await getDoc(ref);
  return event.data();
}

export async function getEvents(hostId, constraints = []) {
  if (hostId) {
    constraints.push(where("hostEmail", "==", hostId));
  }

  const events = await getRecords("events", constraints);
  if (events) {
    return map(events, (e) => ({ id: e.id, ...e.record }));
  } else {
    return [];
  }
}

export async function getEventsByMonth(selectedDate, filters = {}) {
  if (!(filters && selectedDate)) return [];

  const { hostEmail, eventIds } = filters || {};

  const initDate = selectedDate
    .startOf("month")
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0);
  const range = [initDate.toDate(), initDate.clone().add(1, "month").toDate()];
  const constraints = [];
  if (hostEmail) {
    constraints.push(where("hostEmail", "==", hostEmail));
  }
  if (eventIds) {
    constraints.push(where(documentId(), "in", eventIds));
  }

  const events = await getRecords("events", [
    ...constraints,
    where("fromDate", ">", range[0]),
    where("fromDate", "<=", range[1]),
  ]);
  if (events) {
    return map(events, (e) => e.record);
  } else {
    return [];
  }
}
//#region

//#region vendors
export async function getVendors(constraints = []) {
  const vendors = await getRecords("vendors", constraints);
  if (vendors) {
    return map(vendors, (e) => e.record);
  } else {
    return [];
  }
}

export async function getAvailableVendors(
  fromDate,
  toDate,
  currentEventId,
  constraints = []
) {
  let invitees = await getRecords("invitees", [
    where("type", "==", USER_ROLES.vendor.text),
    where("status", "not-in", [
      INVITE_STATUSES.pending.text,
      INVITE_STATUSES.declined.text,
    ]),
  ]);
  invitees = invitees
    .filter((i) => i.eventId !== currentEventId)
    .map((i) => i.record);

  let eventData = await Promise.all(
    invitees.map(async (invitee) => {
      return getEvent(invitee.eventId);
    })
  );
  eventData = eventData.filter((val) => val);

  invitees = invitees
    .filter((invitee, i) => {
      const event = eventData[i];
      if (event && fromDate && toDate) {
        return (
          isDateInRange(
            fromDate,
            event.fromDate.toDate(),
            event.toDate.toDate()
          ) ||
          isDateInRange(toDate, event.fromDate.toDate(), event.toDate.toDate())
        );
      } else {
        return true;
      }
    })
    .map((invitee) => invitee.inviteeId);

  if (!isEmpty(invitees)) {
    constraints.push(where("email", "not-in", invitees));
  }
  const vendors = await getRecords("vendors", [...constraints]);

  if (vendors) {
    return map(vendors, (e) => {
      const record = e.record;
      if (!get(record, "configurations.showServices")) {
        record.services = [];
      }

      return record;
    });
  } else {
    return [];
  }
}
//#region

//#region invitees
export async function getInvitees(filters = {}) {
  const constraints = [];
  map(filters, (val, key) => {
    constraints.push(where(key, "==", val));
  });

  const invitees = await getRecords("invitees", constraints);

  if (invitees) {
    return map(invitees, (e) => e.record);
  } else {
    return [];
  }
}

export async function addInvitee(data) {
  const resp = await addDoc(collection(db, "invitees"), data);
  logEvent(analytics, "select_content", {
    content_type: "vendor",
    content_id: data.eventId + data.inviteeId,
    items: [data],
  });

  return resp;
}

export async function getInvitee(eventId, inviteeId) {
  let invitee = await getRecords("invitees", [
    where("eventId", "==", eventId),
    where("inviteeId", "==", inviteeId),
  ]);
  invitee = get(invitee, "0");

  return invitee;
}

export async function updateInvitee(eventId, inviteeId, data) {
  const invitee = await getInvitee(eventId, inviteeId);
  if (invitee) {
    const ref = doc(db, "invitees", get(invitee, "id"));
    await updateDoc(ref, data);
  }
}

export async function updateInviteStatus(eventId, inviteeId, status) {
  const invitee = await getInvitee(eventId, inviteeId);
  if (invitee) {
    const ref = doc(db, "invitees", get(invitee, "id"));
    invitee.record.status = status;
    await updateDoc(ref, invitee.record);
  }
}

export async function unInviteVendor(eventId, inviteeId) {
  let invitee = await getRecords("invitees", [
    where("eventId", "==", eventId),
    where("inviteeId", "==", inviteeId),
  ]);
  invitee = get(invitee, "0");

  if (invitee) {
    const ref = doc(db, "invitees", get(invitee, "id"));
    await deleteDoc(ref);
  }
}

export async function getEventsInvitedTo(inviteeId, constraints = []) {
  const invitees = await getRecords("invitees", [
    where("inviteeId", "==", inviteeId),
  ]);

  const events = await getRecords("events", [
    where(
      documentId(),
      "in",
      invitees.map((data) => data.record.eventId)
    ),
    ...constraints,
  ]);

  if (events) {
    return map(events, (e) => e.record);
  } else {
    return [];
  }
}
//#region

//#region payments
export async function getPayments(eventId) {
  const payments = await getRecords("payments", [
    where("eventId", "==", eventId),
  ]);

  if (payments) {
    return map(payments, (e) => e.record);
  } else {
    return [];
  }
}

export async function makePayment(data, id) {
  const ref = doc(db, "payments", id);
  return await setDoc(ref, data, { merge: true });
}
//#region

//#region payments
export async function getReviews(filters = {}) {
  const { eventId, inviteeId } = filters || {};
  const constraints = [];
  if (eventId) {
    constraints.push(where("eventId", "==", eventId));
  }
  if (inviteeId) {
    constraints.push(where("inviteeId", "==", inviteeId));
  }

  const reviews = await getRecords("reviews", constraints);

  if (reviews) {
    return map(reviews, (e) => e.record);
  } else {
    return [];
  }
}

export async function rateVendor(data) {
  const review = await addDoc(collection(db, "reviews"), data);
  return review;
}
//#region
