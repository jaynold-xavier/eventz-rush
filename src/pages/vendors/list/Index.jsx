import { SearchOutlined, AudioOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import {
  Col,
  DatePicker,
  Layout,
  Row,
  Select,
  Input,
  Button,
  ConfigProvider,
  Card,
} from "antd";

import useVoice from "../../../hooks/useVoice";

import appTheme from "../../../assets/js/theme";

const { Header, Content } = Layout;

export default function VendorsList() {
  const { text, setText, isListening, listen, voiceSupported } = useVoice();

  // useEffect(() => {
  //   document.body.style.background =
  //     "linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)";

  //   return () => {
  //     document.body.style.removeProperty("background");
  //   };
  // }, []);

  return (
    <Layout prefixCls="vendors-list-layout">
      <Header prefixCls="vendors-list-header center">
        <div className="container">
          <h1 className="header-title text-center">Vendors</h1>

          <br />

          <Input
            placeholder="Search Vendors"
            size="large"
            value={text}
            onChange={(e) => setText(e.target.value)}
            prefix={<SearchOutlined style={{ color: appTheme.colorPrimary }} />}
            // disabled={isListening}
            suffix={
              voiceSupported && (
                <AudioOutlined
                  style={{ color: appTheme.colorPrimary }}
                  onClick={listen}
                />
              )
            }
            allowClear
          />
        </div>
      </Header>

      <div className="shape-divider">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      <Content prefixCls="vendors-list-content">
        <br />
        <br />

        <div className="container">
          <Filters />
        </div>
      </Content>
    </Layout>
  );
}

function Filters() {
  return (
    <Card className="vendors-list-filters">
      <Row className="w-100" gutter={[12, 12]}>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Select className="w-100" placeholder="Select Type" />
        </Col>

        <Col lg={6} md={12} sm={12} xs={12}>
          <DatePicker className="w-100" placeholder="Availability" />
        </Col>
      </Row>
    </Card>
  );
}
