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

import AppLogo from "../../../assets/images/logos/app.svg";

import { appRoutes } from "../../../constants/routes";
import {
  appTheme,
  buttonActionTheme,
  navLinkTheme,
} from "../../../assets/js/theme";
import { signOutOfApp } from "../../../services/auth";
import IconFont from "../../icons/Index";
import { getDisplayName } from "../../../helpers/auth";
import { UserAvatar } from "../../avatar";
import { USER_ROLES } from "../../../constants/app";

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
                    search: `?type=${USER_ROLES.host.key}`,
                  }),
              },
              {
                label: "I am a Vendor",
                onClick: (e) =>
                  goToPage({
                    pathname: appRoutes.register,
                    search: `?type=${USER_ROLES.vendor.key}`,
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

  const content = (
    <>
      <Space
        className="w-100 p-3"
        size={20}
        style={{
          background: "linear-gradient(160deg, #e7e4ff 30%, #ccffff)",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      >
        <UserAvatar
          className="user-avatar justify-content-center"
          src={get(user, "photoURL")}
          size={50}
        />

        <div>
          <div>{getDisplayName(user)}</div>
          <div>{get(user, "email")}</div>
        </div>
      </Space>

      <Divider className="m-0" style={{ borderColor: "gainsboro" }} />

      <Button
        type="text"
        icon={<IconFont type="icon-home" className="font-20 ml-3 mr-4" />}
        onClick={(e) => {
          goToPage(appRoutes.account.dashboard);
        }}
        block
      >
        Dashboard
      </Button>

      <Button
        type="text"
        icon={<IconFont type="icon-logout" className="font-20 ml-3 mr-4" />}
        onClick={(e) => {
          return signOutOfApp().then(() => {
            navigate(0);
          });
        }}
        block
      >
        Logout
      </Button>
    </>
  );

  const authItems = [
    // {
    //   key: "notifications",
    //   label: (
    //     <ConfigProvider
    //       theme={{
    //         token: {
    //           ...buttonActionTheme,
    //           colorText: appTheme.colorText,
    //         },
    //       }}
    //     >
    //       <Popover
    //         title="Notifications"
    //         content="Coming Soon!!"
    //         placement="bottomRight"
    //         trigger="click"
    //       >
    //         <BellOutlined className="font-20" />
    //       </Popover>
    //     </ConfigProvider>
    //   ),
    // },
    {
      key: "account",
      label: (
        <ConfigProvider
          theme={{
            token: {
              colorText: appTheme.colorText,
              colorBorder: appTheme.colorText,
              colorPrimaryBorder: appTheme.colorText,
            },
          }}
        >
          <Popover
            content={content}
            placement="bottomLeft"
            showArrow={false}
            overlayClassName="account-summary-popover"
            overlayInnerStyle={{ borderRadius: "1rem" }}
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
              <UserAvatar
                className="user-avatar justify-content-center"
                src={get(user, "photoURL")}
                size={38}
                hideUpload
              />
            </Tooltip>
          </Popover>
        </ConfigProvider>
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
          colorBgContainer: "transparent",
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
