import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button, Image, Menu } from "antd";

import logo from "../../assets/images/logo.svg";

import { appRoutes } from "../../constants/routes";

export default function Navbar() {
  const location = useLocation();

  return (
    <Menu
      className="main-nav-bar container"
      mode="horizontal"
      direction="rtr"
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key={appRoutes.home}>
        <NavLink to={appRoutes.home}>
          <Image src={logo} width="9rem" preview={false} />
        </NavLink>
      </Menu.Item>

      <Menu.Item key={appRoutes.vendors}>
        <NavLink to={appRoutes.vendors}>Vendors</NavLink>
      </Menu.Item>
      <Menu.Item key={appRoutes.faq}>
        <NavLink to={appRoutes.faq}>FAQ</NavLink>
      </Menu.Item>
      <Menu.Item key={appRoutes.contactUs}>
        <NavLink to={appRoutes.contactUs}>Contact</NavLink>
      </Menu.Item>

      <Menu.Item key={appRoutes.login}>
        <NavLink to={appRoutes.login}>
          <Button type="ghost" icon={<UserOutlined />}>
            Login
          </Button>
        </NavLink>
      </Menu.Item>

      {/* <Menu.Item key={appRoutes.register}>
        <NavLink to={appRoutes.register}>REGISTER</NavLink>
      </Menu.Item> */}
    </Menu>
  );
}
