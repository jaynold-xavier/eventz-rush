import React from "react";
import { Menu } from "antd";
import { Link, NavLink } from "react-router-dom";
import { appRoutes } from "../../constants/routes";

export default function Navbar() {
  return (
    <Menu className="main-nav-bar" mode="horizontal" direction="rtr">
      <Menu.Item>
        <Link to={appRoutes.home}>EVENTZ RUSH</Link>
      </Menu.Item>

      <Menu.SubMenu title="Vendors">
        <Menu.Item>
          <NavLink to={appRoutes.vendors}>Vendors</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to={appRoutes.vendors}>Vendors</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to={appRoutes.vendors}>Vendors</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to={appRoutes.vendors}>Vendors</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to={appRoutes.vendors}>Vendors</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Item>
        <NavLink to={appRoutes.faq}>FAQ</NavLink>
      </Menu.Item>
      <Menu.Item to={appRoutes.contactUs}>
        <NavLink to={appRoutes.contactUs}>Contact Us</NavLink>
      </Menu.Item>

      <Menu.Item>Login</Menu.Item>
      <Menu.Item>Register</Menu.Item>
    </Menu>
  );
}
