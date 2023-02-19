import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Affix, Button, ConfigProvider, Divider, Image, Menu } from "antd";
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
        label: route.toUpperCase(),
        onClick: (e) => goToPage(appRoutes[route]),
      };
    }),
    {
      key: appRoutes.login,
      label: <Button type="primary" ghost>Sign in</Button>,
      onClick: (e) => goToPage(appRoutes.login),
    },
    // {
    //   key: "divider",
    //   label: <Divider type="vertical" />,
    //   className: "p-0",
    // },
    {
      key: appRoutes.register,
      className: "pl-0",
      label: <Button type="primary">Sign up</Button>,
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
          colorPrimary: "#30cfe7",
          colorText: "#63f8e9",
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
