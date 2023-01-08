import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

export function HomePageHeader({ className, title }) {
  return (
    <Header prefixCls="page-header" className={className}>
      <div className="container">
        <h1 className="header-title text-center">{title}</h1>
      </div>

      <br />

      <div className="shape-divider">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="shape-fill"
            d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
          ></path>
        </svg>
      </div>
    </Header>
  );
}
