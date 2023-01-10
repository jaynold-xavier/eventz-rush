import React, { useEffect } from "react";
import { Layout } from "antd";

import { HomePageHeader } from "../../../components/page/index";
import Filters from "./Filters";
import List from "./List";

const { Header, Content } = Layout;

export default function VendorsList() {
  // useEffect(() => {
  //   document.body.style.background =
  //     "linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)";

  //   return () => {
  //     document.body.style.removeProperty("background");
  //   };
  // }, []);

  return (
    <Layout className="vendors-list-layout">
      <HomePageHeader className="vendors-list-header" title="Vendors" />

      <Content prefixCls="vendors-list-content pt-4">
        <div className="container">
          <Filters />

          <br />
          <br />
          <br />

          <List />
        </div>
      </Content>
    </Layout>
  );
}
