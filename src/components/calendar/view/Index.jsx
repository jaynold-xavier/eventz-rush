import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import React from "react";
import { Header } from "antd/es/layout/layout";
import { Button, Calendar } from "antd";

export default function CalendarView({ title, ...rest }) {
  return (
    <Calendar
      {...rest}
      headerRender={({ value, onChange }) => {
        console.log("calender props", { value });

        return (
          <Header prefixCls="p-3">
            {title && <h5>{title}</h5>}

            <div className="d-flex align-items-center justify-content-between">
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
            </div>
          </Header>
        );
      }}
      fullscreen={false}
    />
  );
}
