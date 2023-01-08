import React from "react";
import { Collapse, Layout } from "antd";

import { HomePageHeader } from "../../components/page/index";

const { Header, Content } = Layout;

export default function FAQ() {
  return (
    <Layout className="faq-layout">
      <HomePageHeader className="faq-header" title="FAQ" />

      <Content prefixCls="faq-content pt-3">
        <div className="container">
          <Collapse>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
            <Collapse.Panel header="Question?">Answer</Collapse.Panel>
          </Collapse>
        </div>
      </Content>
    </Layout>
  );
}
