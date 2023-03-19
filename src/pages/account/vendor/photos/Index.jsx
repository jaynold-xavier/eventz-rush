import React from "react";
import { Layout } from "antd";

const { Header, Content } = Layout;

export default function VendorPhotos() {
  return (
    <Layout prefixCls="vendor-dashboard-layout">
      <Header prefixCls="account-header" className="dashboard-header">
        <h5>My Photos</h5>
      </Header>

      <Content></Content>
    </Layout>
  );
}
