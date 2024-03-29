import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";

import { db } from "../assets/js/firebase";
import { isEmpty } from "lodash";

export default function usePaginatedData({
  table,
  constraints = [],
  pageSize = 25,
  transformData,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);

  const docsRef = useRef([]);
  const hasMoreRef = useRef(!!table);

  useEffect(() => {
    let isCancel = false;

    async function loadInitData(isCancel) {
      if (isCancel || !table) {
        setData([]);
        setLoading(false);
        return;
      }

      if (!transformData) {
        constraints?.push(limit(pageSize));
      }

      // Query the first page of docs
      const first = query(collection(db, table), ...constraints);

      let initData = await getData(first);
      if (transformData) {
        initData = transformData(initData);
      }
      console.log("initData", initData, table, constraints);

      hasMoreRef.current = !isEmpty(initData);
      setPage(1);
      setData(initData);
    }

    loadInitData(isCancel);

    return () => {
      isCancel = true;
    };
  }, [table, constraints, reload, transformData, pageSize]);

  const loadPrev = () => {
    setPage((s) => s - 1);
  };

  const loadNext = async () => {
    // Get the last visible document
    const lastVisible = docsRef.current[docsRef.current.length - 1];
    console.log("last", lastVisible);

    // Construct a new query starting at this document,
    // get the next 25 cities.
    const next = query(
      collection(db, table),
      ...constraints,
      startAfter(lastVisible),
      limit(pageSize)
    );

    let nextData = await getData(next);
    if (transformData) {
      nextData = transformData(nextData);
    }
    console.log("nextData", nextData);

    hasMoreRef.current = !isEmpty(nextData);
    setPage((s) => s + 1);
    setData((s) => [...s, ...nextData]);
  };

  return {
    data,
    loadPrev,
    loadNext,
    loading,
    currentPage: page,
    hasMore: hasMoreRef.current,
    setReload,
  };

  async function getData(query) {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(query);
      docsRef.current = [...docsRef.current, ...querySnapshot.docs];

      const data = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data.push({
          id: doc.id,
          record: doc.data(),
        });
      });

      return data;
    } finally {
      setLoading(false);
    }
  }
}
