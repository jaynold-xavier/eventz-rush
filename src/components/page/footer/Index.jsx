import React from "react";
import { Link } from "react-router-dom";
import { Space, Image, Layout } from "antd";

import logo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";

const { Footer } = Layout;

export function HomePageFooter() {
  return (
    <Footer prefixCls="landing-footer">
      <section className="center container pt-0 pb-0">
        <Link to={appRoutes.home}>
          <Image
            alt="app-logo"
            className="app-logo"
            src={logo}
            width="8rem"
            preview={false}
          />
        </Link>

        <h6>&#169; 2023 All Rights Reserved Designed By JXB</h6>

        <Space>
          <Link to={appRoutes.home}>Privacy</Link>
          <Link to={appRoutes.home}>Legal</Link>
        </Space>
      </section>
    </Footer>
  );
}
