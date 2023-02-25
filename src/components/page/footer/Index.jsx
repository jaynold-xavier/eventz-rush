import React from "react";
import { Image, Layout, ConfigProvider, Button, Divider } from "antd";

import logo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";

const { Footer } = Layout;

export function HomePageFooter() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: "#fff",
          colorPrimary: "#2dc3d9",
          colorText: "#40e0d0",
          colorLinkActive: "#fff",
          colorLink: "#fff",
          fontSize: 14,
        },
      }}
    >
      <Footer prefixCls="landing-footer">
        <div className="container">
          <a href={appRoutes.home}>
            <Image
              alt="app-logo"
              className="app-logo"
              src={logo}
              width="8rem"
              preview={false}
            />
          </a>
        </div>

        <Divider />

        <div className="container">
          <span style={{ wordSpacing: 2 }}>
            Copyright &#169; 2023 All Rights Reserved
          </span>

          <span>Design By Jaynold</span>

          <Button type="link" href={appRoutes.home}>
            Privacy & Legal
          </Button>
        </div>
      </Footer>
    </ConfigProvider>
  );
}
