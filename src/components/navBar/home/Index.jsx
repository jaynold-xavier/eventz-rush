import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Affix,
  Button,
  ConfigProvider,
  Divider,
  Image,
  Menu,
  Space,
} from "antd";
import { startCase } from "lodash";

import AppLogo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToPage = (route, options) => {
    navigate(route, options);
  };

  const items = [
    {
      key: appRoutes.home,
      label: (
        <Image
          className="app-logo"
          src={AppLogo}
          width="10rem"
          preview={false}
          alt="app-logo"
        />
      ),
      onClick: (e) => goToPage(appRoutes.home),
    },
    {
      key: appRoutes.vendors.list,
      label: "Vendors",
      onClick: (e) => goToPage(appRoutes.vendors.list),
    },
    ...["faq"].map((route) => {
      return {
        key: appRoutes[route],
        label: startCase(route),
        onClick: (e) => goToPage(appRoutes[route]),
      };
    }),
    {
      key: appRoutes.login,
      className: "ml-5",
      label: startCase("Login"),
      onClick: (e) => goToPage(appRoutes.login),
    },
    {
      key: "divider",
      label: <Divider type="vertical" />,
      className: "p-0",
    },
    {
      key: appRoutes.register,
      label: <Button type="primary">Register</Button>,
      onClick: (e) => goToPage(appRoutes.register),
    },
    // {
    //   label: "sub menu",
    //   key: "submenu",
    //   children: [{ label: "item 3", key: "submenu-item-1" }],
    // },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2dc3d9",
          colorText: "#40e0d0",
        },
      }}
    >
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
    </ConfigProvider>
  );
}
