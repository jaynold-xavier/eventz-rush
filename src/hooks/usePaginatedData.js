import { useEffect, useState } from "react";
import {
  collection,
  query,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";

import { db } from "../assets/js/firebase";
import { useRef } from "react";

export default function usePaginatedData({
  table,
  constraints = [],
  pageSize = 25,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const docsRef = useRef([]);

  useEffect(() => {
    let isCancel = false;

    async function loadInitData(isCancel) {
      if (isCancel) return;

      // Query the first page of docs
      const first = query(
        collection(db, table),
        ...constraints,
        limit(pageSize)
      );

      const initData = await getData(first);
      console.log("initData", initData);
      setData(initData);
    }

    loadInitData(isCancel);

    return () => {
      isCancel = true;
    };
  }, [table, constraints, pageSize]);

  const loadNext = async () => {
    // Get the last visible document
    const lastVisible = data.docs[data.docs.length - 1];
    console.log("last", lastVisible);

    // Construct a new query starting at this document,
    // get the next 25 cities.
    const next = query(
      collection(db, table),
      ...constraints,
      startAfter(lastVisible),
      limit(pageSize)
    );

    const nextData = await getData(next);
    console.log("nextData", nextData);
    setData((s) => [...s, ...nextData]);
  };

  return {
    data,
    loadNext,
    loading,
  };

  async function getData(query) {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(query);
      docsRef.current = [...docsRef.current, ...querySnapshot.docs];

      const data = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push(doc.data());
      });

      return data;
    } finally {
      setLoading(false);
    }
  }
}
