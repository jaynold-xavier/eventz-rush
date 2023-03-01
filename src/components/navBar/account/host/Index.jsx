import { DownOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Affix,
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  Dropdown,
  Image,
  Menu,
  Popover,
  Space,
  Tooltip,
} from "antd";
import { get } from "lodash";

import AppLogo from "../../../../assets/images/logos/app.svg";
import LogOutIcon from "../../../../assets/images/icons/log-out.svg";

import { appRoutes } from "../../../../constants/routes";
import {
  appTheme,
  buttonActionTheme,
  navLinkTheme,
} from "../../../../assets/js/theme";
import { signOutOfApp } from "../../../../services/auth";

export default function HostNavbar({ user }) {
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
          preview={false}
          alt="app-logo"
        />
      ),
      onClick: (e) => goToPage(appRoutes.home),
    },
    {
      key: appRoutes.account.dashboard,
      className: "link-item",
      label: "Dashboard",
      onClick: (e) => goToPage(appRoutes.account.dashboard),
    },
    {
      key: appRoutes.account.events,
      className: "link-item",
      label: "Events",
      onClick: (e) => goToPage(appRoutes.account.events),
    },
    {
      label: <Divider />,
    },
    {
      label: "Log out",
      // icon: <img src={LogOutIcon} />,
      onClick: () => {
        return signOutOfApp().then(() => {
          navigate(appRoutes.home);
        });
      },
    },
  ];

  return (
    <ConfigProvider>
      <Menu
        className="host-nav-bar container"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </ConfigProvider>
  );
}
