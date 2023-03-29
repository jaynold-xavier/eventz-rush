import { useParams } from "react-router-dom";
import React, { useState } from "react";
import { Layout, Affix, Steps, Form, Spin } from "antd";
import { get, has } from "lodash";
import dayjs from "dayjs";

import usePrompt from "../../../../../hooks/usePrompt";
import BasicInfoStep from "./basic/Index";
import SelectVendorsStep from "./selectVendors/Index";
import PaymentStep from "./payment/Index";
import Footer from "./footer/Index";

import useEventWizard from "./useEventWizard";
import useSupportingData from "./useSupportingData";
import {
  EVENT_STATUSES,
  EVENT_WIZARD_STEPS,
} from "../../../../../constants/app";

const { Header, Content } = Layout;

const steps = EVENT_WIZARD_STEPS.map((e) => {
  return {
    key: e.key,
    title: e.text,
  };
});

export default function EventCreateUpdateWizard({ user }) {
  const { id } = useParams();

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const hostEmail = get(user, "email");

  const {
    // state
    form,
    eventId,
    title,
    currentStep,
    netAmount,
    // actions
    setTitle,
    setCurrentStep,
    onStepChange,
    setNetAmount,
    saveChanges,
    cancelChanges,
    generatePaymentInfo,
    payNow,
  } = useEventWizard({ id, user, setLoading, setIsSaving });

  usePrompt((event) => {
    if (form.isFieldsTouched()) {
      event.returnValue = "You have unfinished changes!";
    }

    return event.returnValue;
  });

  const { events, vendors, setFilters } = useSupportingData({
    form,
    eventId,
    hostEmail,
    selectedDate,
    setLoading,
  });

  const onValuesChange = (value, values) => {
    console.log("onValuesChange", value, values);

    if (has(value, "title")) {
      setTitle(get(value, "title"));
    }

    if (has(value, "vendors")) {
      setNetAmount(get(value, "vendors"));
    }
  };

  const onSave = async (e) => {
    await saveChanges();
    setCurrentStep((s) => s + 1);
  };

  const onCancel = async (e) => {
    await cancelChanges();
  };

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep events={events} setSelectedDate={setSelectedDate} />
        );
      case 1:
        return (
          <SelectVendorsStep
            eventId={eventId}
            dataSource={vendors}
            setFilters={setFilters}
          />
        );
      case 2:
        const { bookingPaymentInfo, finalPaymentInfo } = generatePaymentInfo();
        return (
          <PaymentStep
            user={user}
            eventId={eventId}
            netAmount={netAmount}
            bookingPaymentInfo={bookingPaymentInfo}
            finalPaymentInfo={finalPaymentInfo}
            bookEvent={payNow}
          />
        );
      default:
        break;
    }
  };

  const isLastStep = currentStep === EVENT_WIZARD_STEPS.length - 1;
  const isBooked = form.getFieldValue("status") === EVENT_STATUSES.booked.text;

  return (
    <Layout prefixCls="event-create-layout">
      <Affix style={{ boxShadow: "-1px -1px 11px 1px gainsboro" }}>
        <Header prefixCls="event-create-header p-3">
          <div className="text-center mb-3">{title}</div>

          <Steps
            items={steps}
            current={currentStep}
            onChange={isBooked ? undefined : onStepChange}
          />
        </Header>
      </Affix>

      <Content className="p-3">
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            initialValues={window.history.state.usr}
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
        </Spin>
      </Content>

      <Footer
        invitees={form.getFieldValue("vendors")}
        netAmount={netAmount}
        vendors={vendors}
        disablePrev={currentStep === 0 || isBooked}
        loading={isSaving}
        onSave={onSave}
        onCancel={onCancel}
        disableSave={isLastStep}
        onPrev={(e) => setCurrentStep((s) => s - 1)}
      />
    </Layout>
  );
}
