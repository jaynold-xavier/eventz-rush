import { DownOutlined } from "@ant-design/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Affix,
  Button,
  ConfigProvider,
  Dropdown,
  Image,
  Menu,
  Space,
} from "antd";

import AppLogo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";
import {
  appTheme,
  buttonActionTheme,
  navLinkTheme,
} from "../../../assets/js/theme";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToPage = (route, options) => {
    navigate(route, options);
  };

  const menuItems = [
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
        style: { marginRight: "5%" },
      };
    }),
    {
      key: appRoutes.login,
      className: "sign-in-item",
      label: "Login",
      onClick: (e) => goToPage(appRoutes.login),
      style: { marginRight: "1%" },
    },
    // {
    //   key: "divider",
    //   label: <Divider type="vertical" />,
    //   className: "p-0",
    // },
    {
      key: appRoutes.register,
      className: "sign-up-item pl-0",
      label: (
        <ConfigProvider
          theme={{
            token: {
              ...buttonActionTheme,
              colorText: appTheme.colorText,
            },
          }}
        >
          <Dropdown
            menu={{
              items: [
                {
                  key: appRoutes.register,
                  label: "I am a Host",
                  onClick: (e) =>
                    goToPage({
                      pathname: appRoutes.register,
                      search: "?type=host",
                    }),
                },
                {
                  key: appRoutes.register,
                  label: "I am a Vendor",
                  onClick: (e) =>
                    goToPage({
                      pathname: appRoutes.register,
                      search: "?type=vendor",
                    }),
                },
              ],
            }}
            placement="bottomLeft"
          >
            <Button type="primary" size="large">
              <Space>
                Create Account
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </ConfigProvider>
      ),
      // onClick: (e) => goToPage(appRoutes.register),
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
          ...navLinkTheme,
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
            items={menuItems}
          />
        </span>
      </Affix>
    </ConfigProvider>
  );
}
