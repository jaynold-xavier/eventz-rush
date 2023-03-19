import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  UserOutlined,
  AntDesignOutlined,
  ClockCircleTwoTone,
  FilterTwoTone,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Affix,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Layout,
  List,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { where } from "firebase/firestore";
import { get, isEmpty } from "lodash";
import dayjs from "dayjs";

import { getEvents } from "../../../../../services/database";
import { EVENT_STATUSES } from "../../../../../constants/app";
import { appRoutes } from "../../../../../constants/routes";
import IconFont from "../../../../../components/icons/Index";
import { appTheme } from "../../../../../assets/js/theme";
import { timeRangeString } from "../../../../../helpers/timestamp";
import {
  eventStatusesOptions,
  eventTypesOptions,
} from "../../../../../constants/dropdown";
import { SearchInput } from "../../../../../components/fields";

const { Header, Content } = Layout;

const initFilters = {
  period: "upcoming",
  q: "",
  status: [],
  type: "",
};

const constructConstraints = (filters = initFilters) => {
  let { period, q, status, type } = filters;
  const constraints = [];

  if (q) {
    constraints.push(where("title", "==", q));
    constraints.push(where("description", "==", q));
    constraints.push(where("location", "==", q));
  }

  if (period) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    switch (period) {
      case "upcoming":
        constraints.push(where("fromDate", ">", today));
        break;
      case "past":
        constraints.push(where("fromDate", "<", today));
        break;
      default:
        break;
    }
  }

  if (type) {
    constraints.push(where("type", "==", type));
  }

  if (!isEmpty(status)) {
    constraints.push(where("status", "in", status));
  }

  return constraints;
};

export default function EventsList({ user = {} }) {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filters, setFilters] = useState(initFilters);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const hostEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const constraints = constructConstraints(filters);
        const data = await getEvents(hostEmail, constraints);
        setDataSource(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [hostEmail, filters]);

  return (
    <Layout prefixCls="host-events-layout">
      <Affix>
        <Header prefixCls="host-events-header">
          <h5>My Events</h5>

          <Space size={15} wrap>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={(e) => navigate(appRoutes.account.events.create)}
            >
              New Event
            </Button>
          </Space>
        </Header>
      </Affix>

      <Content className="host-events-content">
        <Row className="p-3" gutter={[12, 24]} hidden={loading}>
          <Col span={8}>
            <Button
              type={showFilters ? "primary" : "default"}
              size="large"
              shape="round"
              icon={<FilterTwoTone twoToneColor={appTheme.colorPrimary} />}
              onClick={(e) => setShowFilters((s) => !s)}
            >
              Filters
            </Button>
          </Col>

          <Col span={8}>
            <Radio.Group
              className="w-100"
              buttonStyle="solid"
              size="large"
              defaultValue="upcoming"
              onChange={(e) =>
                setFilters((s) => ({ ...s, period: e.target.value }))
              }
            >
              <Radio.Button
                className="rounded-input text-center"
                value="upcoming"
                style={{ width: "50%" }}
              >
                Upcoming
              </Radio.Button>
              <Radio.Button
                className="rounded-input text-center"
                value="past"
                style={{ width: "50%", marginLeft: "-2rem" }}
              >
                Past
              </Radio.Button>
            </Radio.Group>
          </Col>

          <Col className="text-right" span={8}>
            <SearchInput
              className="w-100"
              placeholder="Search Events"
              size="large"
              style={{ maxWidth: 300 }}
              onChange={(value) => setFilters((s) => ({ ...s, q: value }))}
            />
          </Col>

          {showFilters && (
            <Col span={6}>
              <Select
                className="w-100"
                size="large"
                options={eventTypesOptions}
                placeholder="Select Type"
                onChange={(value) => setFilters((s) => ({ ...s, type: value }))}
                value={filters.type || undefined}
                allowClear
              />
            </Col>
          )}

          {showFilters && (
            <Col span={6}>
              <Select
                className="w-100"
                size="large"
                mode="tags"
                options={eventStatusesOptions}
                placeholder="Select Status"
                onChange={(value) =>
                  setFilters((s) => ({ ...s, status: value }))
                }
                value={filters.status}
                allowClear
              />
            </Col>
          )}
        </Row>

        <List
          className="events-list"
          loading={loading}
          dataSource={dataSource}
          renderItem={renderItem}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No Events"
              />
            ),
          }}
          split={false}
        />
      </Content>
    </Layout>
  );

  function renderItem(item, index) {
    const {
      id,
      bannerURL,
      description,
      fromDate,
      location,
      status,
      title,
      type,
      toDate,
    } = item;

    const fromDateJs = dayjs(fromDate.toDate());
    const toDateJs = dayjs(toDate.toDate());

    const timeText = timeRangeString(fromDateJs, toDateJs);

    let showGroupItem;
    if (index > 0) {
      let prevItemFromDate = get(dataSource[index - 1], "fromDate");
      prevItemFromDate = dayjs(prevItemFromDate.toDate());
      showGroupItem =
        prevItemFromDate.format("MM YYYY") !== fromDateJs.format("MM YYYY");
    } else {
      showGroupItem = true;
    }

    const isDifferentToDate =
      fromDateJs.format("DD MM YYYY") !== toDateJs.format("DD MM YYYY");

    const statusObj = get(EVENT_STATUSES, status);

    return (
      <>
        {showGroupItem && (
          <List.Item className="events-group-list-item text-center">
            <Card
              className="w-100 font-weight-bold"
              bodyStyle={{
                padding: "12px",
                background: "#e5e3f7",
                textTransform: "uppercase",
                boxShadow: "-1px -1px 11px 1px #e5e3f7",
              }}
            >
              {fromDateJs.format("MMMM YYYY")}
            </Card>
          </List.Item>
        )}

        <List.Item className="events-list-item">
          <Card
            className="w-100"
            onClick={(e) =>
              navigate(appRoutes.account.events.details.replace("{id}", id))
            }
            bodyStyle={{
              display: "flex",
              justifyContent: "space-between",
            }}
            hoverable
          >
            <Space className="w-100" size={30} align="baseline" wrap>
              <div
                className="d-flex align-items-center font-weight-bold"
                style={{ fontSize: 32, gap: "12px" }}
              >
                <span>{fromDateJs.format("DD")}</span>

                {isDifferentToDate && (
                  <>
                    <span>-</span>
                    <span className="text-center">
                      <div className="font-18">{toDateJs.format("DD")}</div>
                      <div className="font-10">
                        {toDateJs.format("MMM")} {toDateJs.format("YYYY")}
                      </div>
                    </span>
                  </>
                )}
              </div>

              <div>
                <div>
                  <Typography.Title
                    className="mb-1"
                    level={4}
                    ellipsis={{ tooltip: title }}
                  >
                    {title}
                  </Typography.Title>

                  <Tag color={appTheme.colorPrimary}>{type}</Tag>
                </div>

                <br />

                <Space size={5}>
                  <IconFont
                    type="icon-info"
                    className="font-16"
                    style={{ color: appTheme.colorPrimary }}
                  />

                  <Typography.Paragraph
                    className="font-14 text-grey mb-0"
                    ellipsis={{ rows: 2, tooltip: description }}
                  >
                    {description}
                  </Typography.Paragraph>
                </Space>

                <br />

                <Space size={5}>
                  <IconFont
                    type="icon-location"
                    className="font-16"
                    style={{ color: appTheme.colorPrimary }}
                  />

                  <Typography.Text className="font-14 text-grey" ellipsis>
                    {location}
                  </Typography.Text>
                </Space>

                <br />

                <Space className="font-14">
                  <ClockCircleTwoTone twoToneColor={appTheme.colorPrimary} />
                  <span className="text-grey">{timeText}</span>
                </Space>
              </div>
            </Space>

            <div
              className="d-flex flex-column justify-content-between text-right w-100"
              style={{ gap: "1rem" }}
            >
              {statusObj && (
                <Badge
                  color={get(statusObj, "color")}
                  text={
                    <span className="font-14">{get(statusObj, "text")}</span>
                  }
                />
              )}

              <div className="d-flex justify-content-between w-100">
                <Avatar.Group
                  maxCount={2}
                  maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  <Avatar src="https://joesch.moe/api/v1/random?key=2" />
                  <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
                  <Tooltip title="Ant User" placement="top">
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                  </Tooltip>
                  <Avatar
                    style={{ backgroundColor: "#1890ff" }}
                    icon={<AntDesignOutlined />}
                  />
                </Avatar.Group>

                <div className="price-info">
                  <div className="font-12">Total Cost</div>
                  <h5>12,232.00</h5>
                </div>
              </div>
            </div>
          </Card>
        </List.Item>
      </>
    );
  }
}
