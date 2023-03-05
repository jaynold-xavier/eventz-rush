import { auth, db } from "../assets/js/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { get, isEmpty, map } from "lodash";

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

export async function getUser(id) {
  if (!id) {
    const loggedInUser = await auth.currentUser;
    id = get(loggedInUser, "email");
  }

  const types = ["hosts", "vendors"];

  for (let i = 0; i < types.length; i++) {
    const table = types[i];
    const users = await getRecords(table, [where("email", "==", id)]);
    const user = get(users, "0.record");
    if (user && !isEmpty(user)) {
      return user;
    }
  }
}

export async function getEvents(hostId) {
  if (!hostId) return [];

  const events = getRecords("events", [where("hostEmail", "==", hostId)]);
  if (events) {
    return map(events, (e) => e.record);
  } else {
    return [];
  }
}
