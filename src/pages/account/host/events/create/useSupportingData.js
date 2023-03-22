import { useEffect, useState } from "react";
import { where } from "firebase/firestore";
import { get } from "lodash";

import {
  getAvailableVendors,
  getEventsByMonth,
} from "../../../../../services/database";

const initFilters = {
  q: "",
  type: "",
};

const constructConstraints = (filters = initFilters) => {
  const { q, type } = filters;
  console.log("vendor available", filters);
  const constraints = [];

  if (q) {
    constraints.push(where("title", "==", q));
  }

  if (type) {
    constraints.push(where("type", "==", type));
  }

  return constraints;
};

const useSupportingData = ({
  eventId,
  form,
  hostEmail,
  selectedDate,
  setLoading,
}) => {
  const [events, setEvents] = useState();

  const [filters, setFilters] = useState(initFilters);
  const [vendors, setVendors] = useState();

  useEffect(() => {
    let isCancel = false;

    fetchCreatedEvents(isCancel);

    async function fetchCreatedEvents(isCancel) {
      if (isCancel) return;

      const eventsByMonth = await getEventsByMonth(selectedDate, { hostEmail });
      setEvents(eventsByMonth);
    }

    return () => {
      isCancel = true;
    };
  }, [hostEmail, selectedDate]);

  useEffect(() => {
    let isCancel = false;

    fetchAvailableVendors(isCancel);

    async function fetchAvailableVendors(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);

        const dateRange = form.getFieldValue("date");
        const fromDate = get(dateRange, "0");
        const toDate = get(dateRange, "1");

        const constraints = constructConstraints(filters);
        const data = await getAvailableVendors(
          fromDate,
          toDate,
          eventId,
          constraints
        );
        console.log("init vendors", data);
        setVendors(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [filters, eventId, form, setLoading]);

  return {
    events,
    vendors,
    filters,
    setFilters,
  };
};

export default useSupportingData;
