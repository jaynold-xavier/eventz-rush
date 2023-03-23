import React, { useEffect, useState } from "react";
import { where } from "firebase/firestore";
import { get, isEmpty, map } from "lodash";

import {
  getEvents,
  getInvitees,
  getUser,
} from "../../../../../services/database";
import { EventsList } from "../../../../events";
import { EVENT_STATUSES } from "../../../../../constants/app";

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
    constraints.push(
      where(
        "status",
        "in",
        map(status, (s) => get(EVENT_STATUSES[status], "text") || s)
      )
    );
  }

  return constraints;
};

export default function HostEventsList({ user = {} }) {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filters, setFilters] = useState(initFilters);
  const [showFilters, setShowFilters] = useState(false);

  const hostEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const constraints = constructConstraints(filters);
        const events = await getEvents(hostEmail, constraints);
        const transformedData = await Promise.all(
          events.map(async (e, i) => {
            return await transformEventAsync(e, i);
          })
        );
        console.log({ events, transformedData, filters });
        setDataSource(events);
      } finally {
        setLoading(false);
      }
    }

    async function transformEventAsync(data) {
      const eventId = data.id;
      const invitees = await getInvitees({ eventId });
      data.invitees = invitees;

      const vendors = await Promise.all(
        invitees.map(async (i) => {
          return await getUser(i.inviteeId);
        })
      );
      data.vendors = vendors;

      return data;
    }

    return () => {
      isCancel = true;
    };
  }, [hostEmail, filters]);

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
