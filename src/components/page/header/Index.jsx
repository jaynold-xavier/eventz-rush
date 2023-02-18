import React from "react";
import { Layout } from "antd";

import useBackground from "../../../hooks/useBackground";

const { Header } = Layout;

export function HomePageHeader({ className, title }) {
  useBackground("linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)");

  return (
    <Header prefixCls="page-header" className={className}>
      <div className="container">
        <h1 className="header-title text-center">{title}</h1>
      </div>

      <br />
      <br />
    </Header>
  );
}
