import React, { useEffect, useState } from "react";
import { where } from "firebase/firestore";
import { filter, get, isEmpty } from "lodash";

import { getEvents, getInvitees } from "../../../../services/database";
import { EventsList } from "../../../events";

const initFilters = {
  period: "upcoming",
  q: "",
  status: [],
  type: "",
};

const constructConstraints = (filters = initFilters) => {
  let { period, q, status, type } = filters;
  const constraints = [];

  if (q) {
    constraints.push(where("title", "==", q));
    constraints.push(where("description", "==", q));
    constraints.push(where("location", "==", q));
  }

  if (period) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    switch (period) {
      case "upcoming":
        constraints.push(where("fromDate", ">", today));
        break;
      case "past":
        constraints.push(where("fromDate", "<", today));
        break;
      default:
        break;
    }
  }

  if (type) {
    constraints.push(where("type", "==", type));
  }

  if (!isEmpty(status)) {
    constraints.push(where("status", "in", status));
  }

  return constraints;
};

export default function HostEventsList({ user = {} }) {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [eventIds, setEventIds] = useState();
  const [filters, setFilters] = useState(initFilters);
  const [showFilters, setShowFilters] = useState(false);

  const vendorEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchEventIds(isCancel);

    async function fetchEventIds(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const inviteeEvents = await getInvitees({ inviteeId: vendorEmail });
        const eventIds = inviteeEvents.map((i) => i.eventId);
        setEventIds(eventIds);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [vendorEmail]);

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel || isEmpty(eventIds)) return;

      try {
        setLoading(true);
        const constraints = constructConstraints(filters);
        let data = await getEvents(null, constraints);
        data = filter(data, (e) => eventIds && eventIds.includes(e.id));
        setDataSource(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [eventIds, filters]);

  return (
    <EventsList
      loading={loading}
      filters={filters}
      dataSource={dataSource}
      setFilters={setFilters}
      setShowFilters={setShowFilters}
      showFilters={showFilters}
    />
  );
}
