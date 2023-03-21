import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Form, message } from "antd";
import { filter, get, last } from "lodash";
import dayjs from "dayjs";

import confirmChanges from "../../../../../helpers/prompt";
import { appRoutes } from "../../../../../constants/routes";
import {
  EVENT_STATUSES,
  INVITE_STATUSES,
  EVENT_WIZARD_STEPS,
} from "../../../../../constants/app";
import {
  createEvent,
  getEvent,
  getInvitees,
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
          fetchEventBasicInfo(),
          fetchInvitees(),
        ]);
        const [event = {}, invitees = []] = values;

        form.setFieldsValue({ ...event, vendors: invitees });
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

    return () => {
      isCancel = true;
    };
  }, [id, form, setLoading]);

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
    setNetAmount: updateNetAmount,
    saveChanges,
    cancelChanges,
    updateEvent: updateEventItem,
  };

  function updateTitle(value) {
    setTitle(value || newEventText);
  }

  function updateNetAmount(invitees = []) {
    const netAmount = filter(invitees, (i) => {
      return [
        INVITE_STATUSES.accepted.text,
        INVITE_STATUSES.pending.text,
      ].includes(i.status);
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
  //#region
};

export default useEventWizard;
