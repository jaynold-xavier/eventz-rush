import React from "react";
import { Link } from "react-router-dom";
import { Space, Image, Layout } from "antd";

import logo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";

const { Footer } = Layout;

export function HomePageFooter() {
  return (
    <Footer prefixCls="landing-footer">
      <div className="center container-absolute justify-content-between">
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
      </div>

      <div className="shape-divider">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
    </Footer>
  );
}
