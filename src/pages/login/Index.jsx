import {
  GoogleOutlined,
  FacebookOutlined,
  UserOutlined,
  ArrowRightOutlined,
  LockTwoTone,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Layout,
  message,
  Space,
} from "antd";

import AppLogo from "../../assets/images/logos/app.svg";
import LoginImg from "../../assets/images/form/login.svg";

import { appRoutes } from "../../constants/routes";
import { appTheme } from "../../assets/js/theme";
import {
  authenticateWithFacebook,
  authenticateWithGoogle,
} from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import { getUser } from "../../services/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../assets/js/firebase";

const { Content } = Layout;

export default function Login() {
  const [form] = Form.useForm();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    try {
      setLoading(true);
      const { email, password } = data;

      const response = await signInWithEmailAndPassword(auth, email, password);

      await postLogin(response._tokenResponse.refreshToken, response.user);
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          message.error("User not found");
          break;
        case "auth/invalid-email":
          message.error("Incorrect email");
          break;
        case "auth/wrong-password":
          message.error("Incorrect password");
          break;
        default:
          message.error(error.message);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

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
            form={form}
            className="auth-form"
            layout="vertical"
            validateMessages={{ required: "${label} is required" }}
            onFinish={login}
          >
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input
                placeholder="Email"
                size="large"
                prefix={
                  <UserOutlined style={{ color: appTheme.colorPrimary }} />
                }
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

            <Form.Item className="center mb-0">
              <Button
                className="save-btn icon-animated-button"
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
                loading={loading}
              >
                Login
                <ArrowRightOutlined />
              </Button>
            </Form.Item>
          </Form>

          <Divider orientation="center" dashed>
            Or
          </Divider>

          <div className="w-100 center">
            <Button
              className="google-button text-center"
              type="primary"
              size="large"
              icon={<GoogleOutlined />}
              onClick={onLoginWithGoogle}
              block
            >
              Sign in with Google
            </Button>

            <Button
              className="facebook-button text-center"
              type="primary"
              size="large"
              icon={<FacebookOutlined />}
              onClick={onLoginWithFacebook}
              block
            >
              Sign in with Facebook
            </Button>
          </div>

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

  async function onLoginWithGoogle() {
    const { user, token } = await authenticateWithGoogle();
    await postLogin(token, user);
    return { user, token };
  }

  async function onLoginWithFacebook() {
    const { user, token } = await authenticateWithFacebook();
    await postLogin(token, user);
    return { user, token };
  }

  async function postLogin(token, user) {
    sessionStorage.setItem("Auth Token", token);

    const userData = await getUser(user.email);
    setUser(userData);
  }
}
