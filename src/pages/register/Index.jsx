import {
  GoogleOutlined,
  FacebookOutlined,
  UserOutlined,
  LockTwoTone,
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Form, Image, Input, Layout, Space } from "antd";

import AppLogo from "../../assets/images/logos/app.svg";
import RegisterImg from "../../assets/images/form/register.svg";
import EmailIcon from "../../assets/images/form/email.png";

import { appRoutes } from "../../constants/routes";
import appTheme from "../../assets/js/theme";

const { Content } = Layout;

export default function Register() {
  return (
    <Layout prefixCls="auth-layout">
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

          <h5>Register</h5>
          <p>Create your own account either as a vendor or a host</p>

          <br />

          <Form
            className="auth-form"
            layout="vertical"
            validateMessages={{ required: "${label} is required" }}
          >
            <Form.Item
              name="userName"
              label="Username"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Username"
                size="large"
                prefix={
                  <UserOutlined style={{ color: appTheme.colorPrimary }} />
                }
              />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input
                placeholder="Email"
                size="large"
                prefix={<img src={EmailIcon} alt="email-icon" />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password
                placeholder="Password"
                size="large"
                prefix={<LockTwoTone twoToneColor={appTheme.colorPrimary} />}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[{ required: true }]}
            >
              <Input.Password
                placeholder="Confirm Password"
                size="large"
                prefix={<LockTwoTone twoToneColor={appTheme.colorPrimary} />}
              />
            </Form.Item>

            <Form.Item className="center">
              <Button
                className="save-btn"
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
              >
                Register
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
              Sign up with Google
            </Button>

            <Button
              className="facebook-button"
              type="primary"
              size="large"
              icon={<FacebookOutlined />}
              block
            >
              Sign up with Facebook
            </Button>
          </Space>

          <br />
          <br />

          <div className="text-center">
            Already have an account? <Link to={appRoutes.login}>Sign in</Link>
          </div>
        </div>
      </Content>

      <Content className="auth-image center">
        <Image
          className="login-img"
          src={RegisterImg}
          width="70%"
          preview={false}
          alt="login-img"
        />
      </Content>
    </Layout>
  );
}
