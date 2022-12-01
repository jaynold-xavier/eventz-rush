import { UserOutlined } from "@ant-design/icons";

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Affix, Button, Image, Menu } from "antd";
import { startCase } from "lodash";

import AppLogo from "../../assets/images/logos/app.svg";

import { appRoutes } from "../../constants/routes";

const items = [
  {
    key: "item-1",
    label: (
      <NavLink to={appRoutes.home}>
        <Image
          className="app-logo"
          src={AppLogo}
          width="10rem"
          preview={false}
          alt="app-logo"
        />
      </NavLink>
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
      <NavLink to={appRoutes.login}>
        <Button type="primary" shape="round" icon={<UserOutlined />}>
          Login
        </Button>
      </NavLink>
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
      <Menu
        className="main-nav-bar container"
        mode="horizontal"
        direction="rtr"
        selectedKeys={[location.pathname]}
        items={items}
      />
    </Affix>
  );
}
