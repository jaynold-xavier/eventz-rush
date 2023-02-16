import React from "react";
import { Collapse, Layout } from "antd";

import { HomePageHeader } from "../../components/page/index";

const { Header, Content } = Layout;

export default function Contact() {
  return (
    <Layout className="contact-us-layout">
      <HomePageHeader className="contact-us-header" title="Contact Us" />

      <Content prefixCls="page-content" className="contact-us-content"></Content>
    </Layout>
  );
}
