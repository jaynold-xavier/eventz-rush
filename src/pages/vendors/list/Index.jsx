import React, { useEffect, useState } from "react";
import { Layout } from "antd";

import { getReviews, getVendors } from "../../../services/database";
import { HomePageHeader } from "../../../components/page/index";
import Filters from "./filters/Index";
import List from "./List";
import { where } from "firebase/firestore";
import { isEmpty } from "lodash";
import { getAverageRatings } from "../../../helpers/number";

const { Content } = Layout;

const initFilters = {
  q: "",
  date: [],
  type: [],
};

const constructConstraints = (filters = initFilters) => {
  let { q, type, date } = filters;
  const constraints = [];

  if (q) {
    constraints.push(where("title", "==", q));
    constraints.push(where("description", "==", q));
    constraints.push(where("userName", "==", q));
  }

  if (!isEmpty(date)) {
    const range = [date[0].toDate(), date[1].toDate()];
    constraints.push(where("fromDate", ">", range[0]));
    constraints.push(where("fromDate", "<=", range[1]));
  }

  if (!isEmpty(type)) {
    constraints.push(where("type", "in", type));
  }

  return constraints;
};

export default function VendorsList() {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState();
  const [filters, setFilters] = useState(initFilters);

  useEffect(() => {
    let isCancel = false;

    fetchVendors(isCancel);

    async function fetchVendors(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);

        const constraints = constructConstraints(filters);
        const vendorsList = await getVendors(constraints);
        const transformedData = await Promise.all(
          vendorsList.map(async (v) => {
            const ratings = await getReviews(v.email);
            v.ratings = getAverageRatings(ratings.map((r) => r.rating));
            return v;
          })
        );
        setDataSource(transformedData);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [filters]);

  return (
    <Layout className="vendors-list-layout">
      <HomePageHeader className="vendors-list-header" title="Vendors" />

      <Content prefixCls="page-content" className="vendors-list-content">
        <div className="container">
          <Filters filters={filters} setFilters={setFilters} />

          <br />
          <br />
          <br />

          <List dataSource={dataSource} loading={loading} />
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Content>
    </Layout>
  );
}
