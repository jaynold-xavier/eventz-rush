import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import { Input } from "antd";
import { debounce } from "lodash";

import { appTheme } from "../../../assets/js/theme";

export default function SearchInput({ onChange, ...rest }) {
  const change = (e) => {
    const value = e.target.value;
    onChange && onChange(value);
  };

  return (
    <Input
      className="w-100"
      placeholder="Search"
      size="large"
      prefix={<SearchOutlined style={{ color: appTheme.colorPrimary }} />}
      {...rest}
      onChange={debounce(change, 500)}
    />
  );
}
