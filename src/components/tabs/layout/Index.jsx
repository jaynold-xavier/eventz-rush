import React from "react";
import { Tabs } from "antd";

export default function FilteredTabs({ filter, children, hidden, ...rest }) {
  if (hidden) return null;

  const content = filter ? filter(children) : children;

  return <Tabs {...rest}>{content}</Tabs>;
}
