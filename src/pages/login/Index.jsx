import {
  GoogleOutlined,
  FacebookOutlined,
  UserOutlined,
  LockTwoTone,
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Layout,
  Space,
} from "antd";

import AppLogo from "../../assets/images/logos/app.svg";
import LoginImg from "../../assets/images/form/login.svg";

import { appRoutes } from "../../constants/routes";
import appTheme from "../../assets/js/theme";

const { Content } = Layout;

export default function Login() {
  return (
    <Layout className="auth-layout">
      <Content className="auth-content center">
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

          <h5>Login</h5>
          <p>Sign in to your own account</p>

          <br />

          <Form
            className="auth-form"
            layout="vertical"
            validateMessages={{ required: "${label} is required" }}
          >
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input
                placeholder="Email/Username"
                size="large"
                prefix={
                  <UserOutlined style={{ color: appTheme.colorPrimary }} />
                }
              />
            </Form.Item>

            <Form.Item name="password" label="Password">
              <Input.Password
                placeholder="Password"
                size="large"
                prefix={<LockTwoTone twoToneColor={appTheme.colorPrimary} />}
              />
            </Form.Item>

            <Space className="w-100 justify-content-between mb-3" wrap>
              <Form.Item
                className="mb-0"
                name="rememberMe"
                valuePropName="checked"
              >
                <Checkbox>Remember Me</Checkbox>
              </Form.Item>

              <Link to="/">Forgot Password ?</Link>
            </Space>

            <Form.Item className="center">
              <Button
                className="save-btn"
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Divider orientation="center" dashed>
            Or
          </Divider>

          <Space className="w-100" direction="vertical">
            <Button
              className="google-button"
              type="primary"
              size="large"
              icon={<GoogleOutlined />}
              block
            >
              Sign in with Google
            </Button>

            <Button
              className="facebook-button"
              type="primary"
              size="large"
              icon={<FacebookOutlined />}
              block
            >
              Sign in with Facebook
            </Button>
          </Space>

          <br />
          <br />

          <div className="text-center">
            Don't have an account yet?{" "}
            <Link to={appRoutes.register}>Sign up</Link>
          </div>
        </div>
      </Content>

      <Content className="auth-image center">
        <Image
          className="login-img"
          src={LoginImg}
          width="60%"
          preview={false}
          alt="login-img"
        />
      </Content>
    </Layout>
  );
}
