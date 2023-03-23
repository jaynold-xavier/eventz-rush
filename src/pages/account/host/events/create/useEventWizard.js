import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Form, message } from "antd";
import { filter, get, find, last, size, map, isEmpty } from "lodash";
import dayjs from "dayjs";

import confirmChanges from "../../../../../helpers/prompt";
import { appRoutes } from "../../../../../constants/routes";
import {
  EVENT_STATUSES,
  INVITE_STATUSES,
  EVENT_WIZARD_STEPS,
  PAYMENT_CATEGORIES,
  BOOKING_PAYMENT_PERIOD,
  FINAL_PAYMENT_PERIOD,
} from "../../../../../constants/app";
import {
  createEvent,
  getEvent,
  getInvitees,
  getPayments,
  makePayment,
  updateEvent,
} from "../../../../../services/database";

const newEventText = "New Event";

const useEventWizard = ({ id, user, setLoading }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const eventIdRef = useRef(id);

  const [title, setTitle] = useState(newEventText);
  const [currentStep, setCurrentStep] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  useEffect(() => {
    let isCancel = false;

    if (isCancel === false && id) {
      fetchAll(isCancel);
    }

    async function fetchAll(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const values = await Promise.all([
          fetchPayments(),
          fetchEventBasicInfo(),
          fetchInvitees(),
        ]);
        const [payments = [], event = {}, invitees = []] = values;

        if (size(payments) === size(PAYMENT_CATEGORIES)) {
          message.warning("Cannot update a booked event!");
          navigate(appRoutes.account.dashboard);
        }

        form.setFieldsValue({ ...event, vendors: invitees, payments });
      } catch (error) {
        console.log("event wizard", { error });
        message.error(get(error, "message"));
      } finally {
        setLoading(false);
      }
    }

    async function fetchEventBasicInfo() {
      const event = await getEvent(id);
      console.log("init", event);
      if (event) {
        if (event.fromDate && event.toDate) {
          event.date = [
            dayjs(event.fromDate.toDate()),
            dayjs(event.toDate.toDate()),
          ];
          delete event.fromDate;
          delete event.toDate;
        }

        if (event.bannerURL) {
          event.bannerURL = [
            {
              uid: "1",
              name: "banner",
              thumbUrl: event.bannerURL,
            },
          ];
        } else {
          event.bannerURL = [];
        }

        updateTitle(event.title);
        return event;
      }
    }

    async function fetchInvitees() {
      const invitees = await getInvitees({ eventId: id });
      console.log("init invitees", invitees, id);
      updateNetAmount(invitees);

      return invitees;
    }

    async function fetchPayments() {
      const payments = await getPayments(id);
      map(payments, (p) => {
        if (p.dueDate) {
          p.dueDate = dayjs(p.dueDate.toDate());
        }

        return p;
      });
      return payments;
    }

    return () => {
      isCancel = true;
    };
  }, [id, form, setLoading, navigate]);

  const saveChanges = async () => {
    const data = await validateSection();
    console.log({ validatedData: data });

    switch (currentStep) {
      case 0:
        data.bannerURL = get(data.bannerURL, "0.thumbUrl", "");
        data.fromDate = data.date[0].toDate();
        data.toDate = data.date[1].toDate();
        delete data.date;

        if (eventIdRef.current) {
          await updateEvent(eventIdRef.current, data);
        } else {
          data.status = EVENT_STATUSES.ongoing.text;
          data.hostEmail = get(user, "email");

          eventIdRef.current = await createEvent(data);

          message.success("Event Created!");
        }
        break;
      case 1:
        // update createdOn
        updateEventItem({ createdOn: new Date() });
        break;
      default:
        break;
    }
  };

  const cancelChanges = async () => {
    if (currentStep < last(EVENT_WIZARD_STEPS) - 1) {
      await confirmChanges(form.isFieldsTouched());
    }

    // update step progress
    if (eventIdRef.current) {
      updateEventItem({ stepProgress: EVENT_WIZARD_STEPS[currentStep].key });
    }

    navigate(appRoutes.account.dashboard);
  };

  const payNow = async (data, category) => {
    if (isEmpty(data)) return;

    data.eventId = eventIdRef.current;
    data.category = category;
    data.createdOn = new Date();

    await makePayment(data, data.id);

    switch (category) {
      case PAYMENT_CATEGORIES.booking.key:
        await updateEvent(data.eventId, { status: EVENT_STATUSES.booked.text });
        message.success("Event Booked!");
        break;
      case PAYMENT_CATEGORIES.final.key:
        navigate(appRoutes.account.dashboard);
        message.success("Event Finalized!");
        break;
      default:
        break;
    }

    return data;
  };

  const onStepChange = async (step) => {
    await validateSection();
    setCurrentStep(step);
  };

  return {
    // state
    form,
    eventId: eventIdRef.current,
    title,
    currentStep,
    netAmount,
    // actions
    setTitle: updateTitle,
    setCurrentStep,
    onStepChange,
    setNetAmount: updateNetAmount,
    saveChanges,
    cancelChanges,
    updateEvent: updateEventItem,
    generatePaymentInfo,
    payNow,
  };

  function updateTitle(value) {
    setTitle(value || newEventText);
  }

  function updateNetAmount(invitees = []) {
    const netAmount = filter(invitees, (i) => {
      return [INVITE_STATUSES.accepted.text].includes(i.status);
    })
      .map((i) => i.amount)
      .reduce((prev, curr) => prev + curr, 0);

    setNetAmount(netAmount || 0);
  }

  //#region helpers
  async function updateEventItem(data) {
    const event = form.getFieldsValue();
    Object.assign(event, data);
    delete event.vendors;
    delete event.payments;

    const [key, value] = Object.entries(data)[0];
    form.setFieldValue(key, value);

    await updateEvent(eventIdRef.current, event);
  }

  async function validateSection() {
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
  }

  function generatePaymentInfo() {
    let eventCreatedOn = form.getFieldValue("createdOn");
    if (eventCreatedOn) {
      if (eventCreatedOn.toDate) {
        eventCreatedOn = eventCreatedOn.toDate();
      }
      eventCreatedOn = dayjs(eventCreatedOn);
    } else {
      eventCreatedOn = new Date();
    }

    const acceptedInvitees = filter(
      form.getFieldValue("vendors"),
      (i) => i.status === INVITE_STATUSES.accepted.text
    );
    const totalVendors = size(acceptedInvitees);

    const existingPayments = getExistingPaymentInfo();
    const {
      bookingPaymentInfo: existingBookingPayment,
      finalPaymentInfo: existingFinalPayment,
    } = existingPayments;

    const bookingPaymentParts = BOOKING_PAYMENT_PERIOD.split(" ");
    const bookingPaymentInfo = {
      amount: netAmount / 2,
      quantity: totalVendors,
      dueDate: eventCreatedOn
        .clone()
        .add(bookingPaymentParts[0], bookingPaymentParts[1]),
      ...existingBookingPayment,
    };

    let fromDate = form.getFieldValue("date");
    fromDate = get(fromDate, "0") || dayjs();
    const finalPaymentParts = FINAL_PAYMENT_PERIOD.split(" ");
    const finalPaymentInfo = {
      amount: netAmount / 2,
      quantity: totalVendors,
      dueDate: fromDate
        .clone()
        .subtract(finalPaymentParts[0], finalPaymentParts[1]),
      ...existingFinalPayment,
    };

    return {
      bookingPaymentInfo,
      finalPaymentInfo,
    };

    function getExistingPaymentInfo() {
      const currentPayments = form.getFieldValue("payments");
      const bookingPaymentInfo = find(
        currentPayments,
        (p) => p.category === PAYMENT_CATEGORIES.booking.key
      );
      const finalPaymentInfo = find(
        currentPayments,
        (p) => p.category === PAYMENT_CATEGORIES.final.key
      );

      return {
        bookingPaymentInfo: bookingPaymentInfo || {},
        finalPaymentInfo: finalPaymentInfo || {},
      };
    }
  }
  //#region
};

export default useEventWizard;
