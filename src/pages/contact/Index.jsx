import React from "react";
import { Collapse, Layout } from "antd";

import { HomePageHeader } from "../../components/page/index";

const { Header, Content } = Layout;

export default function FAQ() {
  return (
    <Layout className="contact-us-layout">
      <HomePageHeader className="contact-us-header" title="Contact Us" />

      <Content prefixCls="contact-us-content pt-3"></Content>
    </Layout>
  );
}
