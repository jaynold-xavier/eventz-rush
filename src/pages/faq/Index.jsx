import React from "react";
import { Layout } from "antd";

import { HomePageHeader } from "../../components/page/header/Index";

const { Header, Content } = Layout;

export default function FAQ() {
  return (
    <Layout prefixCls="faq-layout">
      <HomePageHeader className="faq-header" title="FAQ" />

      <Content prefixCls="faq-content pt-3"></Content>
    </Layout>
  );
}
