import { CheckCircleTwoTone, DownloadOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Col,
  Image,
  Layout,
  List,
  message,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { cloneDeep, filter, find, get, isEmpty, map } from "lodash";

import {
  addInvitee,
  createEvent,
  getEvent,
  getInvitees,
  getPayments,
  getReviews,
  getUser,
  rateVendor,
  updateEvent,
} from "../../../services/database";
import { appTheme } from "../../../assets/js/theme";
import {
  commonPopConfirmProp,
  DATETIME_DISPLAY_FORMAT,
  EVENT_STATUSES,
  FULL_DATETIME_DISPLAY_FORMAT,
  INVITE_STATUSES,
  PAYMENT_CATEGORIES,
  USER_ROLES,
} from "../../../constants/app";
import { appRoutes } from "../../../constants/routes";
import VendorItem from "../../vendors/list/item/Index";
import { canCancelEvent, canUpdateEvent } from "../../../helpers/validations";
import useAuth from "../../../hooks/useAuth";
import { CreateReviewLayout } from "../../review";
import { FilteredTabs } from "../../../components/tabs";
import { formatAsCurrency } from "../../../helpers/number";
import { downloadInvoice } from "../../../assets/js/stripe";
import { getUserRole } from "../../../helpers/auth";

const { Header, Content } = Layout;

const dateString = FULL_DATETIME_DISPLAY_FORMAT;

export default function EventDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [vendors, setVendors] = useState();
  const [payments, setPayments] = useState();

  const [showReviewLayout, setShowReviewLayout] = useState(false);
  const [reviews, setReviews] = useState();

  const selectedVendorRef = useRef();

  useEffect(() => {
    let isCancel = false;

    async function fetchPayments(eventId) {
      const payments = await getPayments(eventId);
      return map(payments, (p) => {
        if (p.dueDate) {
          p.dueDate = dayjs(p.dueDate.toDate());
        }

        return p;
      });
    }

    async function fetchReviews(eventId) {
      const reviews = await getReviews({ eventId });
      return reviews;
    }

    async function fetchInvitees(eventId) {
      let invitees = await getInvitees({ eventId });
      invitees = filter(
        invitees,
        (i) => i.status === INVITE_STATUSES.accepted.text
      );
      const promises = map(invitees, (i) => {
        return getUser(i.inviteeId);
      });

      return await Promise.all(promises);
    }

    async function initData(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);

        const event = await getEvent(id);
        if (event) {
          setData(event);

          const values = await Promise.all([
            fetchPayments(id),
            fetchReviews(id),
            fetchInvitees(id),
          ]);
          const [payments = [], reviewsData = {}, vendorsData = []] = values;

          if (payments) {
            setPayments(payments);
          }

          if (vendorsData) {
            setVendors(vendorsData);
          }

          if (reviewsData) {
            setReviews(reviewsData);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    initData(isCancel);

    return () => {
      isCancel = true;
    };
  }, [id]);

  const onUpdateEvent = (e) => {
    navigate(appRoutes.account.events.update.replace("{id}", id));
  };

  const onCloneEvent = async (e) => {
    const clonedData = cloneDeep(data);
    delete clonedData.fromDate;
    delete clonedData.toDate;
    clonedData.status = EVENT_STATUSES.ongoing.text;

    if (clonedData.bannerURL) {
      clonedData.bannerURL = [
        {
          uid: "1",
          name: "banner",
          thumbUrl: clonedData.bannerURL,
        },
      ];
    } else {
      clonedData.bannerURL = [];
    }

    delete clonedData.createdOn;

    navigate(
      {
        pathname: appRoutes.account.events.create,
      },
      { state: clonedData }
    );
  };

  const onCancelEvent = async (e) => {
    data.status = EVENT_STATUSES.cancelled.text;
    await updateEvent(id, data);

    message.success("Event cancelled!");

    navigate(appRoutes.account.dashboard);
  };

  const onRateVendor = (item) => {
    selectedVendorRef.current = item;
    setShowReviewLayout(true);
  };

  const rateVendorAsync = async (data) => {
    data.eventId = id;
    await rateVendor(data);

    const rData = reviews || [];
    rData.push(data);
    setReviews(rData);

    message.success("Vendor reviewed!");
  };

  const filterTabs = (children) => {
    return filter(children, (c) => {
      if (c.key === "vendors") {
        return !isEmpty(vendors);
      }

      if (c.key === "invoices") {
        return !isEmpty(payments);
      }

      return false;
    });
  };

  const {
    bannerURL,
    description,
    fromDate,
    location,
    status,
    title,
    toDate,
    amount,
    type,
  } = data || {};

  const fromDateString =
    fromDate && dayjs(fromDate.toDate()).format(dateString);

  const toDateString = toDate && dayjs(toDate.toDate()).format(dateString);

  const statusObj = find(EVENT_STATUSES, (e) => e.text === status);

  const isVendor = getUserRole(user) === USER_ROLES.vendor.key;

  return (
    <Layout prefixCls="event-details-layout">
      <Spin spinning={loading}>
        <Header prefixCls="event-details-header position-relative">
          {bannerURL && (
            <Image
              rootClassName="banner-img"
              src={bannerURL}
              width="100%"
              preview={false}
              alt="event-banner"
            />
          )}

          <div className="header-info">
            <div>
              <Typography.Title
                className="mb-1"
                level={3}
                ellipsis={{ tooltip: title }}
                style={{ maxWidth: "50vw" }}
              >
                {title}
              </Typography.Title>

              <Space>
                <Tag color={appTheme.colorPrimary}>{type}</Tag>
                {statusObj && (
                  <Badge
                    color={get(statusObj, "color")}
                    text={
                      <span className="font-14">{get(statusObj, "text")}</span>
                    }
                  />
                )}
              </Space>
            </div>

            <Space className="ml-auto" size={10}>
              {canUpdateEvent(data) && !isVendor && (
                <Button type="primary" onClick={onUpdateEvent}>
                  Update
                </Button>
              )}

              {!isVendor && (
                <Popconfirm
                  title="Are you sure you want to clone the event?"
                  onConfirm={onCloneEvent}
                  placement="bottomRight"
                  {...commonPopConfirmProp}
                >
                  <Button type="primary">Clone</Button>
                </Popconfirm>
              )}

              {canCancelEvent(data) && !isVendor && (
                <Popconfirm
                  title="Are you sure you want to cancel the event?"
                  onConfirm={onCancelEvent}
                  placement="bottomRight"
                  {...commonPopConfirmProp}
                >
                  <Button>Cancel</Button>
                </Popconfirm>
              )}
            </Space>
          </div>
        </Header>

        <Content prefixCls="event-details-content">
          <Row className="event-basic-info" gutter={0}>
            {description && (
              <Col span={24}>
                <strong className="font-14">Description</strong>
                <div
                  className="font-18 mt-1"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </Col>
            )}

            {fromDateString && (
              <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                <strong className="font-14">From</strong>
                <div className="font-18 mt-1">{fromDateString}</div>
              </Col>
            )}

            {toDateString && (
              <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                <strong className="font-14">To</strong>
                <div className="font-18 mt-1">{toDateString}</div>
              </Col>
            )}

            {location && (
              <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
                <strong className="font-14">Where</strong>
                <div className="font-18 mt-1">{location}</div>
              </Col>
            )}

            {amount && (
              <Col
                className="text-right"
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={6}
                xxl={6}
              >
                <strong className="font-14">Total Cost</strong>
                <div className="font-18 mt-1">{amount}</div>
              </Col>
            )}
          </Row>

          <br />

          <FilteredTabs size="large" filter={filterTabs}>
            <Tabs.TabPane key="vendors" tab="Vendors">
              <VendorsList
                dataSource={vendors}
                isEventClosed={[EVENT_STATUSES.closed.text].includes(status)}
                reviews={reviews}
                onRateVendor={onRateVendor}
              />
            </Tabs.TabPane>

            <Tabs.TabPane key="invoices" tab="Invoices">
              <PaymentsList
                dataSource={payments}
                isEventClosed={[EVENT_STATUSES.closed.text].includes(status)}
              />
            </Tabs.TabPane>
          </FilteredTabs>

          <CreateReviewLayout
            open={showReviewLayout}
            saveChanges={rateVendorAsync}
            vendorInfo={selectedVendorRef.current}
            onCancel={(e) => {
              selectedVendorRef.current = null;
              setShowReviewLayout(false);
            }}
          />
        </Content>
      </Spin>
    </Layout>
  );
}

function VendorsList({ dataSource, isEventClosed, reviews, onRateVendor }) {
  return (
    <List
      className="vendors-list mt-1"
      dataSource={dataSource}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4,
      }}
      renderItem={renderItem}
    />
  );

  function renderItem(item) {
    const hasReview = find(reviews, (r) => r.inviteeId === item.email);
    const actions = [];
    if (isEventClosed && !hasReview) {
      actions.push(
        <Button type="primary" onClick={(e) => onRateVendor(item)} block>
          Rate Vendor
        </Button>
      );
    }

    return <VendorItem data={item} actions={actions} />;
  }
}

function PaymentsList({ dataSource, isEventClosed }) {
  return (
    <List
      className="payments-status-list mt-1"
      dataSource={dataSource}
      renderItem={RenderPaymentStatusItem}
    />
  );
}

function RenderPaymentStatusItem(item) {
  const { dueDate, category, status, amount, invoiceId } = item || {};

  const [loading, setLoading] = useState(false);

  const onDownload = async (e) => {
    try {
      setLoading(true);

      await downloadInvoice(invoiceId);
    } finally {
      setLoading(false);
    }
  };

  const isPaid = status === "succeeded";

  return (
    <List.Item>
      <List.Item.Meta
        title={PAYMENT_CATEGORIES[category].text}
        avatar={
          isPaid && (
            <CheckCircleTwoTone className="font-24" twoToneColor="#40cf85" />
          )
        }
      />

      <div>
        <Space size={30}>
          {isPaid && (
            <Tooltip title="Download Invoice">
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={loading}
                onClick={onDownload}
              />
            </Tooltip>
          )}

          <h5 className="text-right">{formatAsCurrency(amount)}</h5>
        </Space>

        {dueDate && !isPaid && (
          <div className="font-14 mt-1 font-weight-light">
            Due on {dueDate.format(DATETIME_DISPLAY_FORMAT)}
          </div>
        )}
      </div>
    </List.Item>
  );
}
