import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import React from "react";
import { Button, Calendar, Layout } from "antd";

const { Header } = Layout;

export default function CalendarView(props) {
  return (
    <Calendar {...props} headerRender={CalendarHeader} fullscreen={false} />
  );
}

function CalendarHeader({ value, onChange }) {
  console.log("calender header props", { value });

  return (
    <Header
      className="align-items-center justify-content-between p-3"
      prefixCls="d-flex"
    >
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          let now = value.clone().month(value.month() - 1);
          onChange(now);
        }}
      />

      <div className="text-center">
        <h6>{value.format("MMMM")}</h6>
        <div className="font-12 text-grey">{value.year()}</div>
      </div>

      <Button
        type="link"
        icon={<ArrowRightOutlined />}
        onClick={() => {
          let now = value.clone().month(value.month() + 1);
          onChange(now);
        }}
      />
    </Header>
  );
}
