import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "antd/lib/layout/layout";
import { Space, Image } from "antd";

import logo from "../../assets/images/logos/app.svg";

import { appRoutes } from "../../constants/routes";

export default function LandingFooter() {
  return (
    <Footer prefixCls="landing-footer">
      <section className="center container">
        <Link to={appRoutes.home}>
          <Image
            alt="app-logo"
            className="app-logo"
            src={logo}
            width="6rem"
            preview={false}
          />
        </Link>

        <h4>&#169; 2023 All Rights Reserved Designed By JXB</h4>

        <Space>
          <Link to={appRoutes.home}>Privacy</Link>
          <Link to={appRoutes.home}>Legal</Link>
        </Space>
      </section>
    </Footer>
  );
}
