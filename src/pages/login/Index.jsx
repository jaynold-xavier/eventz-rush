import { GoogleOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Image, Layout } from "antd";

import AppLogo from "../../assets/images/logos/app.svg";
import LoginImg from "../../assets/images/register.svg";
import { appRoutes } from "../../constants/routes";

const { Content } = Layout;

export default function Login() {
  return (
    <Layout prefixCls="login-layout">
      <Content className="login-content center">
        <div className="container">
          <Link to={appRoutes.home}>
            <Image
              className="app-logo"
              src={AppLogo}
              width="6rem"
              preview={false}
              alt="app-logo"
            />
          </Link>

          <br />
          <br />
          <br />

          <h3 className="bold">Login</h3>

          <br />

          <Button
            shape="round"
            icon={
              <img
                className="mr-2"
                src="https://img.icons8.com/color/48/null/google-logo.png"
                width={20}
                alt="google-icon"
              />
            }
            size="large"
            block
          >
            Sign In with Google
          </Button>
        </div>
      </Content>

      <Content className="login-image center">
        <Image
          className="login-img"
          src={LoginImg}
          width="50%"
          preview={false}
          alt="login-img"
        />
      </Content>
    </Layout>
  );
}
