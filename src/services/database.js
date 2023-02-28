import { db } from "../assets/js/firebase";
import { addDoc, collection, query, getDocs, where } from "firebase/firestore";
import { isEmpty } from "lodash";

// Add a new document in collection
export async function addDocToTable(table, data) {
  const existing = await findDocInTable(table, { email: data.email });
  if (isEmpty(existing)) {
    return await addDoc(collection(db, table), data);
  } else {
    return existing;
  }
}

export async function findDocInTable(table, constraints = {}) {
  const [key, value] = Object.entries(constraints)[0];

  const q = query(collection(db, table), where(key, "==", value));

  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push({
      uid: doc.id,
      ...doc.data(),
    });
    console.log(doc.id, " => ", doc.data());
  });
  return data;
}
