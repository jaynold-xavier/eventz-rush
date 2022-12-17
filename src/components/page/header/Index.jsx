import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

export function HomePageHeader({ className, title }) {
  return (
    <Header prefixCls={className}>
      <div className="container">
        <h1 className="header-title text-center">{title}</h1>
      </div>
    </Header>
  );
}
