import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Image, Menu } from "antd";

import logo from "../../assets/images/logo.svg";

import { appRoutes } from "../../constants/routes";

export default function Navbar() {
  return (
    <Menu className="main-nav-bar container" mode="horizontal" direction="rtr">
      <Menu.Item>
        <NavLink to={appRoutes.home}>
          <Image src={logo} width="9rem" preview={false} />
        </NavLink>
      </Menu.Item>

      <Menu.Item>
        <NavLink to={appRoutes.vendors}>Vendors</NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to={appRoutes.faq}>FAQ</NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to={appRoutes.contactUs}>Contact</NavLink>
      </Menu.Item>

      <Menu.Item>
        <Button type="ghost">
          <NavLink to={appRoutes.login}>Login</NavLink>
        </Button>
      </Menu.Item>
      {/* <Menu.Item>
        <NavLink to={appRoutes.register}>REGISTER</NavLink>
      </Menu.Item> */}
    </Menu>
  );
}
