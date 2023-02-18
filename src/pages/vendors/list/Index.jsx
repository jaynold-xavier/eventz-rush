import React from "react";
import { Layout } from "antd";

import { HomePageHeader } from "../../../components/page/index";
import Filters from "./templates/Filters";
import List from "./List";

const { Header, Content } = Layout;

export default function VendorsList() {
  return (
    <Layout className="vendors-list-layout">
      <HomePageHeader className="vendors-list-header" title="Vendors" />

      <Content prefixCls="page-content" className="vendors-list-content">
        <div className="container">
          <Filters />

          <br />
          <br />
          <br />

          <List />
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
