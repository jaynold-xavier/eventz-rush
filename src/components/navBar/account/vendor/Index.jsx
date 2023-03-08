import {
  PictureOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, ConfigProvider, Image, Menu, Typography } from "antd";
import { get } from "lodash";

import AppLogo from "../../../../assets/images/logos/app.svg";
import LogOutIcon from "../../../../assets/images/icons/LogOut";
import DashboardIcon from "../../../../assets/images/icons/Dashboard";
import EventsIcon from "../../../../assets/images/icons/Documents";

import { appRoutes } from "../../../../constants/routes";
import { signOutOfApp } from "../../../../services/auth";
import useAuth from "../../../../hooks/useAuth";
import { getDisplayName } from "../../../../helpers/auth";

export default function VendorNavbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const goToPage = (route, options) => {
    navigate(route, options);
  };

  const logOut = () => {
    return signOutOfApp().then(() => {
      setUser(null);
      navigate(appRoutes.home);
    });
  };

  const navItems = [
    {
      key: appRoutes.home,
      label: (
        <Image
          rootClassName="app-logo d-block m-auto"
          src={AppLogo}
          preview={false}
          alt="app-logo"
          width="70%"
        />
      ),
      style: { height: "auto" },
      onClick: (e) => goToPage(appRoutes.home),
    },
    {
      key: appRoutes.account.dashboard,
      className: "link-item mt-5",
      label: "Dashboard",
      icon: <DashboardIcon />,
      onClick: (e) => goToPage(appRoutes.account.dashboard),
    },
    {
      key: appRoutes.account.events.list,
      className: "link-item mt-2",
      icon: <EventsIcon />,
      label: "Events",
      onClick: (e) => goToPage(appRoutes.account.events.list),
    },
    {
      key: appRoutes.account.photos,
      className: "link-item mt-2",
      icon: <PictureOutlined />,
      label: "Photos",
      onClick: (e) => goToPage(appRoutes.account.photos),
    },
    {
      key: appRoutes.account.settings,
      className: "link-item mt-2",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: (e) => goToPage(appRoutes.account.settings),
    },
  ];

  const userItems = [
    {
      key: "user",
      label: (
        <div className="d-inline-flex flex-column">
          <Typography.Text>{getDisplayName(user)}</Typography.Text>
          <Typography.Text className="font-14 text-grey mb-0">
            {get(user, "email")}
          </Typography.Text>
        </div>
      ),
      icon: (
        <Avatar
          className="user-avatar"
          src={get(user, "photoURL")}
          icon={<UserOutlined />}
          size={38}
        />
      ),
      style: { height: "auto" },
    },
    { type: "divider", style: { margin: "10px 0" } },
    {
      key: appRoutes.home,
      label: "Logout",
      icon: <LogOutIcon />,
      onClick: logOut,
    },
  ];

  return (
    // <ConfigProvider theme={{ token: { colorText: "#c1bfd5" } }}>
    <ConfigProvider>
      <Menu
        className="host-nav-bar h-100 p-0 pt-3"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={navItems}
      />

      <Menu
        className="host-nav-bar position-sticky p-0"
        style={{ bottom: 0 }}
        mode="inline"
        selectedKeys={[location.pathname]}
        items={userItems}
      />
    </ConfigProvider>
  );
}
