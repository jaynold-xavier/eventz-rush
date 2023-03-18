import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Layout, Affix, Steps, Space, Button, Form, message } from "antd";
import { get } from "lodash";

import usePrompt from "../../../../../hooks/usePrompt";
import confirmChanges from "../../../../../helpers/prompt";
import { appRoutes } from "../../../../../constants/routes";
import { EVENT_STATUSES } from "../../../../../constants/app";
import {
  createEvent,
  getEvent,
  updateEvent,
} from "../../../../../services/database";
import BasicInfoStep from "./basic/Index";
import SelectVendorsStep from "./selectVendors/Index";
import PaymentStep from "./payment/Index";
import dayjs from "dayjs";

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

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("New Event");
  const [currentStep, setCurrentStep] = useState(0);
  const eventIdRef = useRef(id);

  usePrompt((event) => {
    console.log("unchanged");
    if (form.isFieldsTouched()) {
      console.log("changed");
      event.returnValue = "You have unfinished changes!";
    }

    return event.returnValue;
  });

  useEffect(() => {
    let isCancel = false;

    async function loadEvent(isCancel) {
      if (isCancel || !id) return;

      const event = await getEvent(id);
      if (event) {
        event.date = [
          dayjs(event.fromDate.toDate()),
          dayjs(event.toDate.toDate()),
        ];
        delete event.fromDate;
        delete event.toDate;

        form.setFieldsValue(event);
      }
    }

    loadEvent(isCancel);

    return () => {
      isCancel = true;
    };
  }, [id]);

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep hostEmail={get(user, "email")} />;
      case 1:
        return <SelectVendorsStep form={form} eventId={eventIdRef.current} />;
      case 2:
        return <PaymentStep form={form} />;
      default:
        break;
    }
  };

  const validateSection = async () => {
    let data;
    switch (currentStep) {
      case 0:
        data = await form.validateFields([
          "bannerURL",
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

  const onValuesChange = (value, values) => {
    setTitle(get(values, "title") || "New Event");
  };

  const saveChanges = async () => {
    let data = await validateSection();
    console.log({ data });
    switch (currentStep) {
      case 0:
        data.bannerURL = data.bannerURL || "";
        data.fromDate = data.date[0].toDate();
        data.toDate = data.date[1].toDate();
        delete data.date;

        if (eventIdRef.current) {
          await updateEvent(eventIdRef.current, data);

          message.success("Event Updated!");
        } else {
          data.createdOn = new Date();
          data.status = EVENT_STATUSES.ongoing.text;
          data.hostEmail = get(user, "email");

          eventIdRef.current = await createEvent(data);

          message.success("Event Created!");
        }
        break;
      default:
        break;
    }
  };

  const cancelChanges = async () => {
    await confirmChanges(form.isFieldsTouched());
    navigate(appRoutes.account.dashboard);
  };

  return (
    <Layout prefixCls="event-create-layout">
      <Affix style={{ boxShadow: "-1px -1px 11px 1px gainsboro" }}>
        <Header prefixCls="event-create-header p-3">
          <div className="text-center mb-3">{title}</div>

          <Steps items={steps} current={currentStep} />
        </Header>
      </Affix>

      <Content className="p-3">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={onValuesChange}
          validateMessages={{ required: "${label} is required" }}
          scrollToFirstError={{
            behavior: "smooth",
            block: "center",
            inline: "center",
          }}
        >
          {stepContent()}
        </Form>
      </Content>

      <Footer
        prefixCls="event-create-footer"
        className="d-flex justify-content-between flex-wrap bg-white"
      >
        <Space className="ml-auto" size={12}>
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
              await saveChanges();
              setCurrentStep((s) => s + 1);
            }}
            disabled={currentStep === steps.length - 1}
          >
            Save and Continue
          </Button>

          <Button size="large" onClick={cancelChanges}>
            Cancel
          </Button>
        </Space>
      </Footer>
    </Layout>
  );
}
