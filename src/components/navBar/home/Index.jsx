import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Affix, Button, ConfigProvider, Image, Menu } from "antd";
import { startCase } from "lodash";

import AppLogo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";

const items = [
  {
    key: "item-1",
    label: (
      <Link to={appRoutes.home}>
        <Image
          className="app-logo"
          src={AppLogo}
          width="10rem"
          preview={false}
          alt="app-logo"
        />
      </Link>
    ),
  },
  ...["vendors", "faq", "contactUs"].map((route) => {
    return {
      key: appRoutes[route],
      label: <NavLink to={appRoutes[route]}>{startCase(route)}</NavLink>,
    };
  }),
  {
    key: appRoutes.login,
    label: (
      <Link to={appRoutes.login}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#24b1c6",
            },
          }}
        >
          <Button type="primary" shape="round" icon={<UserOutlined />}>
            Login
          </Button>
        </ConfigProvider>
      </Link>
    ),
  },
  // {
  //   label: "sub menu",
  //   key: "submenu",
  //   children: [{ label: "item 3", key: "submenu-item-1" }],
  // },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <Affix className="main-nav-bar-affix-container">
      <span>
        <Menu
          className="main-nav-bar container"
          mode="horizontal"
          direction="rtr"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </span>
    </Affix>
  );
}
