import { DownOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Affix,
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Image,
  Menu,
  Popover,
  Space,
  Tooltip,
} from "antd";
import { get } from "lodash";

import AppLogo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";
import {
  appTheme,
  buttonActionTheme,
  navLinkTheme,
} from "../../../assets/js/theme";
import { signOutOfApp } from "../../../services/auth";

export default function Navbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const goToPage = (route, options) => {
    navigate(route, options);
  };

  const unAuthItems = [
    {
      key: appRoutes.login,
      className: "link-item",
      label: "Login",
      onClick: (e) => goToPage(appRoutes.login),
      style: { marginRight: "1%" },
    },
    {
      key: appRoutes.register,
      className: "sign-up-item pl-0",
      label: (
        <DropdownMenu
          menu={{
            items: [
              {
                label: "I am a Host",
                onClick: (e) =>
                  goToPage({
                    pathname: appRoutes.register,
                    search: "?type=host",
                  }),
              },
              {
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
        </DropdownMenu>
      ),
      // onClick: (e) => goToPage(appRoutes.register),
    },
  ];

  const authItems = [
    {
      key: "notifications",
      label: (
        <ConfigProvider
          theme={{
            token: {
              ...buttonActionTheme,
              colorText: appTheme.colorText,
            },
          }}
        >
          <Popover
            title="Notifications"
            content="Coming Soon!!"
            placement="bottomRight"
            trigger="click"
          >
            <BellOutlined className="font-20" />
          </Popover>
        </ConfigProvider>
      ),
      onClick: (e) => goToPage(appRoutes.home),
    },
    {
      key: "account",
      label: (
        <DropdownMenu
          menu={{
            items: [
              {
                label: "Dashboard",
                onClick: () => goToPage(appRoutes.account.dashboard),
              },
              {
                label: "Log out",
                onClick: () => {
                  return signOutOfApp().then(() => {
                    navigate(0);
                  });
                },
              },
            ],
          }}
          placement="bottomLeft"
          trigger="click"
        >
          <Tooltip
            placement="bottomRight"
            title={
              <>
                <div className="text-light-grey">Account Info</div>
                <div>{get(user, "displayName")}</div>
                <div>{get(user, "email")}</div>
              </>
            }
            arrowPointAtCenter
          >
            <Avatar
              className="user-avatar"
              src={get(user, "photoURL")}
              icon={<UserOutlined />}
              size={38}
            />
          </Tooltip>
        </DropdownMenu>
      ),
    },
  ];

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
      className: "link-item",
      label: "Vendors",
      onClick: (e) => goToPage(appRoutes.vendors.list),
    },
    ...["faq"].map((route) => {
      return {
        key: appRoutes[route],
        className: "link-item",
        label: route.toUpperCase(),
        onClick: (e) => goToPage(appRoutes[route]),
        style: { marginRight: "5%" },
      };
    }),
    // {
    //   label: "sub menu",
    //   key: "submenu",
    //   children: [{ label: "item 3", key: "submenu-item-1" }],
    // },
  ];

  if (user) {
    menuItems.push(...authItems);
  } else {
    menuItems.push(...unAuthItems);
  }

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

function DropdownMenu({ ...rest }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          ...buttonActionTheme,
          colorText: appTheme.colorText,
        },
      }}
    >
      <Dropdown {...rest} />
    </ConfigProvider>
  );
}
