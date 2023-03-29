import React from "react";
import { Collapse, Layout } from "antd";

import { HomePageHeader } from "../../components/page/index";

const { Content } = Layout;

export default function FAQ() {
  return (
    <Layout className="faq-layout">
      <HomePageHeader
        className="faq-header"
        title="Frequently Asked Questions"
      />

      <Content prefixCls="page-content" className="faq-content">
        <div className="container">
          <Collapse expandIconPosition="end" accordion>
            <Collapse.Panel header="How to create an account?">
              <ol start={1}>
                <li>Click on Create Account</li>
                <li>Select user type</li>
                <li>Enter your credentials or sign in with social media</li>
                <li>Hit "Register"</li>
              </ol>
            </Collapse.Panel>

            <Collapse.Panel header="How to book an event?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="I am not able book an event for next week. How can I do so?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="How to contact vendor?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="How to cancel an event?">
              Duis fugiat mollit amet tempor. Aliqua non amet duis qui ad
              cupidatat aute tempor commodo minim labore veniam. Laborum sit
              ipsum cillum sit velit eiusmod Lorem enim duis irure elit anim
              consectetur voluptate. Ipsum eu enim pariatur anim proident
              reprehenderit deserunt cupidatat officia. Occaecat id magna dolor
              id nulla adipisicing exercitation irure reprehenderit pariatur
              fugiat adipisicing minim fugiat. Cupidatat id ea anim veniam
              fugiat Lorem ullamco sunt.
            </Collapse.Panel>

            <Collapse.Panel header="How to create a copy of an event?">
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

        <br />
        <br />
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
