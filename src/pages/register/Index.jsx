import {
  ArrowRightOutlined,
  FacebookOutlined,
  GoogleOutlined,
  LockTwoTone,
  MailTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Image,
  Input,
  Layout,
  message,
  Progress,
  Radio,
} from "antd";
import { find, get, map } from "lodash";

import { createUserWithEmailAndPassword } from "firebase/auth";

import AppLogo from "../../assets/images/logos/app.svg";
import RegisterImg from "../../assets/images/form/register.svg";

import { appRoutes } from "../../constants/routes";
import { appTheme } from "../../assets/js/theme";
import { auth } from "../../assets/js/firebase";
import { userRolesOptions, vendorTypesOptions } from "../../constants/dropdown";
import {
  authenticateWithFacebook,
  authenticateWithGoogle,
} from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import { addUser } from "../../services/database";
import { VENDOR_TYPES } from "../../constants/app";
import { stripeInstance } from "../../assets/js/stripe";
import { getDisplayName } from "../../helpers/auth";

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
          <p>Create your own account either as a vendor or a host</p>

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
              <UserTypeSelector />
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
              rules={[{ required: true }, { min: 8 }]}
            >
              <PasswordField />
            </Form.Item>

            {/* <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: "Please confirm your password" },
              ]}
            >
              <Input.Password
                placeholder="Confirm Password"
                size="large"
                prefix={<LockTwoTone twoToneColor={appTheme.colorPrimary} />}
              />
            </Form.Item> */}

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
      title: user.displayName || userName || "",
      userName,
    };

    if (type !== "host") {
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
      data.stripeId = stripeInfo.id;
    }

    await addUser(data, type);
    setUser(data);
  }
}

function UserTypeSelector({ value, onChange, ...rest }) {
  const setVendorType = ({ key }) => {
    const vendorType = find(vendorTypesOptions, (opt) => opt.key === key);
    if (vendorType) {
      onChange(vendorType.value);
    }
  };

  const isHostSelected = !value || value === userRolesOptions[0].value;
  let vendorSelectText;
  if (!isHostSelected) {
    vendorSelectText =
      value === userRolesOptions[1].value
        ? "Select Vendor"
        : get(VENDOR_TYPES[value], "text");
  }

  return (
    <Radio.Group
      className="type-field w-100"
      buttonStyle="solid"
      value={transformValue(value)}
      onChange={onChange}
      {...rest}
    >
      {map(userRolesOptions, (option) => {
        return (
          <Radio.Button
            key={option.value}
            className="text-center"
            value={option.value}
            style={{ width: "50%" }}
          >
            {option.value === userRolesOptions[0].value ? (
              option.label
            ) : (
              <Dropdown
                menu={{
                  items: vendorTypesOptions,
                  selectable: true,
                  selectedKeys: [value],
                  onClick: setVendorType,
                }}
                open={isHostSelected ? false : undefined}
              >
                {isHostSelected ? (
                  <span>{option.label}</span>
                ) : (
                  <div>{`${vendorSelectText} ▼`}</div>
                )}
              </Dropdown>
            )}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );

  function transformValue(value) {
    if (!value) return;

    return value === userRolesOptions[0].value
      ? userRolesOptions[0].value
      : userRolesOptions[1].value;
  }
}

const okRegex = new RegExp("(?=.{8,})", "g");
const weakRegex = new RegExp("(?=.*[A-Z])", "g");
const goodRegex = new RegExp("(?=.*[0-9])", "g");
const strongRegex = new RegExp("(?=.*[^A-Za-z0-9])", "g");

const colors = ["#ff4500", "#fade14", "#87d068", "#008000"];

function PasswordField({ value, ...rest }) {
  const percent = [okRegex, weakRegex, goodRegex, strongRegex]
    .map((regex) => {
      return !!value && regex.test(value);
    })
    .reduce((prev = 0, curr) => prev + curr);

  const strokeColor = { 0: colors[0] };
  for (let i = 0; i < percent; i++) {
    const key = Math.round(((i + 1) / percent) * 100);
    strokeColor[key] = colors[i];
  }

  return (
    <>
      <Input.Password
        placeholder="Password"
        size="large"
        prefix={<LockTwoTone twoToneColor={appTheme.colorPrimary} />}
        value={value}
        {...rest}
      />

      {/* <Progress
        className="w-100"
        percent={25 * percent}
        steps={4}
        strokeColor={colors}
        showInfo={false}
      /> */}

      <Progress
        className="mb-0"
        status="active"
        percent={25 * percent}
        strokeColor={strokeColor}
        showInfo={false}
      />
    </>
  );
}
