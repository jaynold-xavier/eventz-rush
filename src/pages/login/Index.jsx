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
// import EmailIcon from "../../assets/images/form/email.png";
import BlobImg1 from "../../assets/images/shapes/shape-3.svg";

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
          <p>Sign in to your account</p>

          <br />

          <Form className="login-form" layout="vertical">
            <Form.Item name="email" label="Email">
              <Input
                placeholder="Email/Username"
                size="large"
                prefix={
                  <UserOutlined
                    className="font-24"
                    style={{ color: "#753dff" }}
                  />
                }
              />
            </Form.Item>

            <Form.Item name="password" label="Password">
              <Input.Password
                placeholder="Password"
                size="large"
                prefix={
                  <LockTwoTone className="font-24" twoToneColor="#753dff" />
                }
              />
            </Form.Item>

            <Space className="w-100 justify-content-between mb-3" wrap>
              <Form.Item className="mb-0" name="rememberMe">
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

      <Content className="login-image center">
        <Image
          className="login-img"
          src={LoginImg}
          width="50%"
          preview={false}
          alt="login-img"
        />

        {/* <Image
          className="blob"
          rootClassName="blob-img"
          src={BlobImg1}
          alt="blob"
          width="30rem"
          preview={false}
        /> */}
      </Content>
    </Layout>
  );
}
