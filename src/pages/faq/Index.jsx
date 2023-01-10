import React from "react";
import { Collapse, Layout } from "antd";

import { HomePageHeader } from "../../components/page/index";

const { Header, Content } = Layout;

export default function FAQ() {
  return (
    <Layout className="faq-layout">
      <HomePageHeader
        className="faq-header"
        title="Frequently Asked Questions"
      />

      <Content prefixCls="faq-content pt-3">
        <div className="container">
          <Collapse expandIconPosition="right" accordion>
            <Collapse.Panel header="Question?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="Question?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="Question?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="Question?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="Question?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="Question?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>
          </Collapse>
        </div>
      </Content>
    </Layout>
  );
}
