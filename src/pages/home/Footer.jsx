import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "antd/lib/layout/layout";
import { Space, Image, Divider } from "antd";

import JBLogo from "../../assets/images/logos/jblogo.svg";
import logo from "../../assets/images/logos/logo.svg";

import { appRoutes } from "../../constants/routes";

export default function LandingFooter() {
  return (
    <Footer prefixCls="landing-footer">
      <section className="center container">
        <Image
          className="app-logo"
          alt="owner-logo"
          src={JBLogo}
          width="6rem"
          preview={false}
        />
        
        <h4>&#169; 2023 All Rights Reserved Designed By Jaden Rice</h4>
      </section>

      <Divider className="mt-2 mb-2" />

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

        <Space>
          <Link to={appRoutes.home}>Privacy</Link>
          <Link to={appRoutes.home}>Legal</Link>
        </Space>
      </section>
    </Footer>
  );
}
