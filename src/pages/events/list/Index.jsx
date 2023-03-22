import {
  PlusOutlined,
  ClockCircleTwoTone,
  FilterTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  Affix,
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
  Typography,
} from "antd";
import { filter, find, get } from "lodash";
import dayjs from "dayjs";

import { EVENT_STATUSES, INVITE_STATUSES } from "../../../constants/app";
import { appRoutes } from "../../../constants/routes";
import { appTheme } from "../../../assets/js/theme";
import { timeRangeString } from "../../../helpers/timestamp";
import {
  eventStatusesOptions,
  eventTypesOptions,
} from "../../../constants/dropdown";
import { SearchInput } from "../../../components/fields";
import IconFont from "../../../components/icons/Index";
import { InviteesGroup } from "../../../components/avatar";
import { formatAsCurrency } from "../../../helpers/number";
import useAuth from "../../../hooks/useAuth";

const { Header, Content } = Layout;

export default function EventsList({
  loading,
  dataSource,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isVendor = !!get(user, "type");

  return (
    <Layout prefixCls="events-list-layout">
      <Affix>
        <Header
          prefixCls="events-list-header"
          className="d-flex justify-content-between bg-white p-3"
        >
          <h5>My Events</h5>

          {!isVendor && (
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
          )}
        </Header>
      </Affix>

      <Content prefixCls="events-content">
        <Row className="filters p-3 m-0" gutter={[12, 24]} hidden={loading}>
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
          className="events-list p-3"
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
          split={<br />}
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
      toDate,
      type,
      vendors,
      invitees,
    } = item;

    const fromDateJs = dayjs(fromDate.toDate());
    const toDateJs = dayjs(toDate.toDate());

    const timeText = timeRangeString(fromDateJs, toDateJs);
    const isSameDay = fromDateJs.isSame(toDateJs, "day");

    const statusObj = find(EVENT_STATUSES, (e) => e.text === status);
    const netAmount = filter(invitees, (i) => {
      return [
        INVITE_STATUSES.accepted.text,
        INVITE_STATUSES.pending.text,
      ].includes(i.status);
    })
      .map((i) => i.amount)
      .reduce((prev, curr) => prev + curr, 0);

    let showGroupItem;
    if (index > 0) {
      let prevItemFromDate = get(dataSource[index - 1], "fromDate");
      prevItemFromDate = dayjs(prevItemFromDate.toDate());
      showGroupItem =
        prevItemFromDate.format("MM YYYY") !== fromDateJs.format("MM YYYY");
    } else {
      showGroupItem = true;
    }

    return (
      <>
        {showGroupItem && (
          <List.Item className="events-group-list-item">
            <span className="m-auto">{fromDateJs.format("MMMM YYYY")}</span>
          </List.Item>
        )}

        <List.Item
          className="events-list-item p-0"
          onClick={(e) =>
            navigate(appRoutes.account.events.details.replace("{id}", id))
          }
        >
          <div className="date-badge m-auto">
            <div>
              <h3 style={{ lineHeight: "3rem" }}>{fromDateJs.format("DD")}</h3>
              <div className="font-12">{fromDateJs.format("MMM YYYY")}</div>
            </div>

            {!isSameDay && (
              <>
                <div className="font-12 mt-1">TO</div>

                <div>
                  <h3 style={{ lineHeight: "3rem" }}>
                    {toDateJs.format("DD")}
                  </h3>
                  <div className="font-12">{toDateJs.format("MMM YYYY")}</div>
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <Typography.Title
                className="mb-1"
                level={3}
                ellipsis={{ tooltip: title }}
                style={{ maxWidth: "50vw" }}
              >
                {title}
              </Typography.Title>

              {statusObj && (
                <Badge
                  className="d-flex align-items-center p-3"
                  color={get(statusObj, "color")}
                  text={
                    <span className="font-14">{get(statusObj, "text")}</span>
                  }
                />
              )}
            </div>

            <Tag color={appTheme.colorPrimary}>{type}</Tag>

            <Space className="mt-1">
              <IconFont
                type="icon-info"
                className="font-16"
                style={{ color: appTheme.colorPrimary }}
              />

              <Typography.Paragraph
                className="font-14 text-grey mb-0"
                ellipsis={{
                  rows: 2,
                  tooltip: (
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                  ),
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </Typography.Paragraph>
            </Space>

            <br />

            <Space className="mt-1">
              <IconFont type="icon-location" className="font-16 text-primary" />

              <Typography.Text
                className="font-14"
                style={{ maxWidth: "50vw" }}
                ellipsis={{ tooltip: location }}
              >
                {location}
              </Typography.Text>
            </Space>

            <br />

            <Space className="font-14 mt-1">
              <ClockCircleTwoTone twoToneColor={appTheme.colorPrimary} />
              <span>{timeText}</span>
            </Space>

            <div className="d-flex align-items-center justify-content-between mt-3">
              <InviteesGroup
                className="ml-auto mr-auto"
                value={invitees}
                vendors={vendors}
              />

              {!!netAmount && (
                <div className="price-info text-right">
                  <div className="font-12">Total Amount</div>
                  <h5>{formatAsCurrency(netAmount)}</h5>
                </div>
              )}
            </div>
          </div>
        </List.Item>
      </>
    );
  }
}
