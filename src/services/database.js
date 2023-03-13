import { auth, db } from "../assets/js/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { get, isEmpty, map } from "lodash";
import { INVITE_STATUSES, USER_ROLES } from "../constants/app";
import { isDateInRange } from "../helpers/timestamp";

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
//#region

//#region events
export async function getEvent(id) {
  if (!id) return null;

  const ref = doc(db, "events", id);
  const event = await getDoc(ref);
  return event.data();
}

export async function getEvents(hostId, constraints = []) {
  if (!hostId) return [];

  const events = await getRecords("events", [
    where("hostEmail", "==", hostId),
    ...constraints,
  ]);
  if (events) {
    return map(events, (e) => ({ id: e.id, ...e.record }));
  } else {
    return [];
  }
}

export async function getEventsByMonth(hostId, date) {
  if (!hostId) return [];

  const dtString = date.format("YYYY-MM");
  const range = [
    new Date(dtString),
    new Date(new Date(dtString).setMonth(new Date(dtString).getMonth() + 1)),
  ];

  const events = await getRecords("events", [
    where("hostEmail", "==", hostId),
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
export async function getAvailableVendors(fromDate, toDate, constraints = []) {
  let invitees = await getRecords("invitees", [
    where("type", "==", USER_ROLES.vendor.text),
    where("status", "not-in", [
      INVITE_STATUSES.pending.text,
      INVITE_STATUSES.declined.text,
    ]),
  ]);
  invitees = invitees.map((i) => i.record);

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

  console.log({ eventData, invitees });

  if (!isEmpty(invitees)) {
    constraints.push(where("email", "not-in", invitees));
  }
  const vendors = await getRecords("vendors", [...constraints]);

  if (vendors) {
    return map(vendors, (e) => e.record);
  } else {
    return [];
  }
}
//#region
