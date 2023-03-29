import { LockTwoTone } from "@ant-design/icons";
import { Input, Progress } from "antd";
import React from "react";

import { appTheme } from "../../../assets/js/theme";

const okRegex = new RegExp("(?=.{8,})", "g");
const weakRegex = new RegExp("(?=.*[A-Z])", "g");
const goodRegex = new RegExp("(?=.*[0-9])", "g");
const strongRegex = new RegExp("(?=.*[^A-Za-z0-9])", "g");

const colors = ["#ff4500", "#fade14", "#87d068", "#008000"];

export default function PasswordField({ value, ...rest }) {
  const percent = [okRegex, weakRegex, goodRegex, strongRegex]
    .map((regex) => {
      return !!value && regex.test(value);
    })
    .reduce((prev = 0, curr) => prev + curr);

  const strokeColor = { 0: colors[0] };
  for (let i = 0; i < percent; i++) {
    const key = Math.round(((i + 1) / percent) * 100);
    strokeColor[key] = colors[i];
  }

  return (
    <>
      <Input.Password
        placeholder="Password"
        size="large"
        prefix={<LockTwoTone twoToneColor={appTheme.colorPrimary} />}
        value={value}
        {...rest}
      />

      <Progress
        className="mb-0"
        status="active"
        percent={25 * percent}
        strokeColor={strokeColor}
        showInfo={false}
      />
    </>
  );
}
