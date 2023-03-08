import { useNavigate } from "react-router-dom";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Affix,
  Badge,
  Button,
  Card,
  Empty,
  Input,
  Layout,
  List,
  Space,
} from "antd";
import { get } from "lodash";
import dayjs from "dayjs";

import { getEvents } from "../../../../../services/database";
import { EVENT_STATUSES } from "../../../../../constants/app";
import { appRoutes } from "../../../../../constants/routes";

const { Header, Content } = Layout;

export default function EventsList({ user = {} }) {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const hostEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const data = await getEvents(hostEmail);
        console.log({ data });
        setDataSource(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [hostEmail]);

  return (
    <Layout prefixCls="host-events-layout">
      <Affix>
        <Header prefixCls="host-events-header">
          <h5>My Events</h5>

          <Space size={15}>
            <Input
              placeholder="Search Events"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={(e) => navigate(appRoutes.account.events.create)}
            >
              New Event
            </Button>
          </Space>
        </Header>
      </Affix>

      <Content>
        <List
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
          split={null}
        />
      </Content>
    </Layout>
  );

  function renderItem({
    bannerUrl,
    description,
    fromDate,
    location,
    status,
    title,
    toDate,
  }) {
    const fromDateJs = fromDate && dayjs(fromDate.toDate());
    const fromDateText = fromDateJs && fromDateJs.format("DD MMM YYYY HH:mm");

    const toDateJs = toDate && dayjs(toDate.toDate());
    const toDateText = toDateJs && toDateJs.format("DD MMM YYYY HH:mm");

    const statusColor = get(
      EVENT_STATUSES,
      `${status && status.toLowerCase()}.color`
    );

    return (
      <List.Item>
        <Card className="w-100" bodyStyle={{ display: "flex" }}>
          <List.Item.Meta title={title} description={description} />

          <Badge
            color={statusColor}
            text={<span className="font-14">{status}</span>}
          />
        </Card>
      </List.Item>
    );
  }
}
