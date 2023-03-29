import {
  ArrowRightOutlined,
  FacebookOutlined,
  GoogleOutlined,
  MailTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Divider, Form, Image, Input, Layout, message } from "antd";

import { createUserWithEmailAndPassword } from "firebase/auth";

import AppLogo from "../../assets/images/logos/app.svg";
import RegisterImg from "../../assets/images/form/register.svg";

import { appRoutes } from "../../constants/routes";
import { appTheme } from "../../assets/js/theme";
import { auth } from "../../assets/js/firebase";
import { userRolesOptions } from "../../constants/dropdown";
import {
  authenticateWithFacebook,
  authenticateWithGoogle,
} from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import { addUser } from "../../services/database";
import { USER_ROLES, VENDOR_TYPES } from "../../constants/app";
import { stripeInstance } from "../../assets/js/stripe";
import { getDisplayName } from "../../helpers/auth";
import { PasswordField, UserRoleSelect } from "../../components/fields";

const { Content } = Layout;

export default function Register() {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const register = async (data) => {
    try {
      setLoading(true);
      const { email, password } = data;

      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await postRegister(response._tokenResponse.refreshToken, response.user);

      navigate(appRoutes.login);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        message.error("Email already registered");
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

          <h5>Register</h5>
          <p className="mt-3">
            Create your own account either as a vendor or a host
          </p>

          <br />

          <Form
            form={form}
            className="auth-form"
            layout="vertical"
            validateMessages={{
              types: { email: "Please enter a valid email" },
              required: "${label} is required",
            }}
            onFinish={register}
          >
            <Form.Item
              name="type"
              label="I am a"
              rules={[
                { required: true, message: "Please select a user type" },
                {
                  // validateTrigger: "onSubmit",
                  validator: (rule, value) => {
                    if (value && value === userRolesOptions[1].value) {
                      return Promise.reject(
                        new Error("Please select a vendor type")
                      );
                    }
                    return Promise.resolve(true);
                  },
                },
              ]}
              labelCol={{
                className: "text-center text-uppercase",
                style: { wordSpacing: 10 },
              }}
              initialValue={searchParams.get("type")}
              required={false}
            >
              <UserRoleSelect />
            </Form.Item>

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

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input
                placeholder="Email"
                size="large"
                prefix={<MailTwoTone twoToneColor={appTheme.colorPrimary} />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true },
                {
                  min: 8,
                  message: "Your password must be at least 8 characters long",
                },
              ]}
            >
              <PasswordField />
            </Form.Item>

            <br />

            <Form.Item className="center mb-0">
              <Button
                className="save-btn icon-animated-button"
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
                loading={loading}
              >
                Register
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
              onClick={onRegisterWithGoogle}
              block
            >
              Sign up with Google
            </Button>

            <Button
              className="facebook-button text-center"
              type="primary"
              size="large"
              icon={<FacebookOutlined />}
              onClick={onRegisterWithFacebook}
              block
            >
              Sign up with Facebook
            </Button>
          </div>

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

  async function onRegisterWithGoogle() {
    await form.validateFields(["type"]);

    const { user, token } = await authenticateWithGoogle();
    await postRegister(token, user);
    return { user, token };
  }

  async function onRegisterWithFacebook() {
    await form.validateFields(["type"]);

    const { user, token } = await authenticateWithFacebook();
    await postRegister(token, user);
    return { user, token };
  }

  async function postRegister(token, user) {
    sessionStorage.setItem("Auth Token", token);

    const { userName = null, type } = form.getFieldsValue();
    const data = {
      email: user.email,
      photoURL: user.photoURL || "",
      phoneNumber: user.phoneNumber || "",
      userName,
    };

    if (type !== USER_ROLES.host.key) {
      data.title = user.displayName || userName || "";
      data.type = VENDOR_TYPES[type].text;
      data.configurations = {
        showContactInfo: true,
        showServices: true,
      };
    } else {
      const stripeInfo = await stripeInstance.customers.create({
        email: data.email,
        phone: data.phoneNumber,
        name: getDisplayName(data),
      });

      data.type = USER_ROLES.host.text;
      data.stripeId = stripeInfo.id;
    }

    await addUser(data, type);
    setUser(data);
  }
}
