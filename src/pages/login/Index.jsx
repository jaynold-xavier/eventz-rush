import {
  GoogleOutlined,
  FacebookOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Form, Image, Input, Layout, Space } from "antd";

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

          <Form className="login-form" layout="vertical">
            <Form.Item name="email">
              <Input
                placeholder="Email"
                prefix={
                  <UserOutlined
                    className="font-20"
                    style={{ color: "purple" }}
                  />
                }
              />
            </Form.Item>

            <Form.Item name="password">
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined style={{ color: "purple" }} />}
              />
            </Form.Item>
          </Form>

          <Divider orientation="center" dashed>
            Or
          </Divider>

          <Space className="w-100" direction="vertical">
            <Button
              className="google-button"
              size="large"
              icon={<GoogleOutlined />}
              block
            >
              Sign in with Google
            </Button>

            <Button
              className="facebook-button"
              size="large"
              icon={<FacebookOutlined />}
              block
            >
              Sign in with Facebook
            </Button>
          </Space>
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
