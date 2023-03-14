import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Layout, Affix, Steps, Space, Button, Form, Popconfirm } from "antd";
import { findIndex, get } from "lodash";

import BasicInfoStep from "./basic/Index";
import usePrompt from "../../../../../hooks/usePrompt";
import SelectVendorsStep from "./selectVendors/Index";
import confirmChanges from "../../../../../helpers/prompt";
import { appRoutes } from "../../../../../constants/routes";

const { Header, Content, Footer } = Layout;

const steps = [
  {
    key: "basic",
    title: "Basic Info",
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

export default function EventCreateUpdateWizard({ user }) {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  let initStep = searchParams.get("step") || steps[0].key;
  initStep = findIndex(steps, (step) => step.key === initStep);
  initStep = initStep || 0;

  const [currentStep, setCurrentStep] = useState(initStep);

  // TODO: recheck, its not working
  usePrompt({
    when: true,
    onOk: () => {
      console.log("onOK");
      return true;
    },
    onCancel: () => {
      console.log("onCancel");
      return true;
    },
  });

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set("step", steps[currentStep].key);
      return prev;
    });
  }, [currentStep, setSearchParams]);

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep hostEmail={get(user, "email")} />;
      case 1:
        return <SelectVendorsStep form={form} />;
      default:
        break;
    }
  };

  const validateSection = async () => {
    let data;
    switch (currentStep) {
      case 0:
        data = await form.validateFields([
          "bannerUrl",
          "date",
          "description",
          "location",
          "title",
          "type",
        ]);
        break;
      case 1:
        data = await form.validateFields(["vendors"]);
        break;
      default:
        data = await form.validateFields();
        break;
    }

    return data;
  };

  const saveChanges = async () => {
    const data = await validateSection();
    console.log({ data });
  };

  const cancelChanges = async () => {
    await confirmChanges(form.isFieldsTouched());
    navigate(appRoutes.account.dashboard);
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
        <Form
          form={form}
          layout="vertical"
          validateMessages={{ required: "${label} is required" }}
        >
          {stepContent()}
        </Form>
      </Content>

      <Footer
        prefixCls="event-create-footer"
        className="d-flex justify-content-between flex-wrap bg-white"
      >
        <Space>
          <Popconfirm
            title="Are you sure you want to save changes?"
            onConfirm={saveChanges}
          >
            <Button type="primary" size="large">
              Save Changes
            </Button>
          </Popconfirm>

          <Button size="large" onClick={cancelChanges}>
            Cancel
          </Button>
        </Space>

        <Space>
          <Button
            type="primary"
            size="large"
            onClick={(e) => {
              setCurrentStep((s) => s - 1);
            }}
            disabled={currentStep === 0}
          >
            Prev
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={async (e) => {
              await validateSection();
              setCurrentStep((s) => s + 1);
            }}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </Space>
      </Footer>
    </Layout>
  );
}
