import { useSearchParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  ConfigProvider,
  Layout,
  Affix,
  Steps,
  Space,
  Button,
  Form,
} from "antd";
import { findIndex } from "lodash";
import BasicInfoStep from "./basic/Index";
import ScheduleStep from "./schedule/Index";

const { Header, Content, Footer } = Layout;

const steps = [
  {
    key: "basic",
    title: "Basic Info",
  },
  {
    key: "schedule",
    title: "Schedule",
  },
  {
    key: "selectVendors",
    title: "Select Vendors",
  },
  {
    key: "payment",
    title: "Payment",
  },
];

export default function EventsList() {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  let initStep = searchParams.get("step") || steps[0].key;
  initStep = findIndex(steps, (step) => step.key === initStep);
  initStep = initStep || 0;

  const [currentStep, setCurrentStep] = useState(initStep);

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set("step", steps[currentStep].key);
      return prev;
    });
  }, [currentStep, setSearchParams]);

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <ScheduleStep />;
      default:
        break;
    }
  };

  return (
    <Layout prefixCls="event-create-layout">
      <Affix style={{ boxShadow: "-1px -1px 11px 1px gainsboro" }}>
        <Header prefixCls="event-create-header p-3">
          <div className="text-center mb-3">NEW EVENT</div>

          <Steps
            items={steps}
            current={currentStep}
            // onChange={setCurrentStep}
          />
        </Header>
      </Affix>

      <Content className="p-3">
        <Form form={form} layout="vertical">
          {stepContent()}
        </Form>
      </Content>

      <Footer prefixCls="event-create-footer" className="d-flex bg-white">
        <Space className="ml-auto">
          <Button
            type="primary"
            size="large"
            onClick={(e) => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 0}
          >
            Prev
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={(e) => setCurrentStep((s) => s + 1)}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
          <Button size="large">Cancel</Button>
        </Space>
      </Footer>
    </Layout>
  );
}
