import {
  UserOutlined,
  PictureOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, ConfigProvider, Image, Menu, Typography } from "antd";
import { get } from "lodash";

import AppLogo from "../../../../assets/images/logos/app.svg";
import DashboardIcon from "../../../../assets/images/icons/Dashboard";
import EventsIcon from "../../../../assets/images/icons/Events";

import { appRoutes } from "../../../../constants/routes";
import { signOutOfApp } from "../../../../services/auth";
import useAuth from "../../../../hooks/useAuth";

import BlobImg3 from "../../../../assets/images/shapes/shape-2.svg";
import { getDisplayName } from "../../../../helpers/auth";
import IconFont from "../../../icons/Index";

export default function HostNavbar({ user, collapsed }) {
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
      label: "Home",
      icon: (
        <Image
          rootClassName="app-logo d-block m-auto"
          src={AppLogo}
          preview={false}
          alt="app-logo"
          width="60%"
        />
      ),
      onClick: (e) => goToPage(appRoutes.home),
    },
    {
      key: "user",
      className: "user-item mt-5 pt-2 pb-2",
      label: (
        <div className="d-flex flex-column align-items-center">
          <Typography.Text className="mt-1">
            {getDisplayName(user)}
          </Typography.Text>
          <Typography.Text className="font-12 text-grey mb-0">
            {get(user, "email")}
          </Typography.Text>
        </div>
      ),
      icon: (
        <Avatar
          className="user-avatar justify-content-center"
          src={get(user, "photoURL")}
          icon={<UserOutlined style={{ fontSize: "100%" }} />}
          size={collapsed ? 25 : 80}
        />
      ),
    },
    {
      key: appRoutes.account.dashboard,
      className: "link-item mt-5",
      label: "Dashboard",
      icon: <DashboardIcon />,
      onClick: (e) => goToPage(appRoutes.account.dashboard),
    },
    {
      key: appRoutes.account.profile,
      className: "link-item",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: (e) => goToPage(appRoutes.account.profile),
    },
    {
      key: appRoutes.account.events.list,
      className: "link-item",
      icon: <EventsIcon />,
      label: "Events",
      onClick: (e) => goToPage(appRoutes.account.events.list),
    },
    {
      key: appRoutes.account.photos,
      className: "link-item",
      icon: <PictureOutlined />,
      label: "Photos",
      onClick: (e) => goToPage(appRoutes.account.photos),
    },
    {
      key: appRoutes.account.settings,
      className: "link-item",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: (e) => goToPage(appRoutes.account.settings),
    },
  ];

  const userItems = [
    { type: "divider" },
    {
      key: appRoutes.home,
      label: "Logout",
      icon: <IconFont type="icon-logout" className="font-20" />,
      onClick: logOut,
    },
  ];

  return (
    // <ConfigProvider theme={{ token: { colorText: "#c1bfd5" } }}>
    <ConfigProvider>
      <Image
        className="blob-3"
        rootClassName="blob-img"
        src={BlobImg3}
        width="30rem"
        preview={false}
        alt="blob-3"
      />

      <Menu
        className="host-nav-bar h-100 pt-3"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={navItems}
      />

      <Menu
        className="host-nav-bar position-sticky"
        style={{ bottom: 0 }}
        mode="inline"
        selectedKeys={[location.pathname]}
        items={userItems}
      />
    </ConfigProvider>
  );
}
