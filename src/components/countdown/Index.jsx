import React from "react";
import { Space, Statistic } from "antd";

export default function Countdown({ value }) {
  return (
    <div className="countdown">
      <Statistic.Countdown
        format="DD : HH : mm : ss"
        value={value}
        style={{ lineHeight: "1rem" }}
      />

      <Space
        className="text-light-grey font-10 font-weight-bold"
        size={30}
        style={{ marginLeft: 5 }}
      >
        <span>Days</span>
        <span>Hours</span>
        <span>Mins</span>
        <span>Secs</span>
      </Space>
    </div>
  );
}
