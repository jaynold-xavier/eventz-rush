import {
  GoogleOutlined,
  FacebookOutlined,
  UserOutlined,
  LockTwoTone,
  ArrowRightOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Image,
  Input,
  Layout,
  Progress,
  Radio,
  Space,
} from "antd";
import { find, map } from "lodash";

import AppLogo from "../../assets/images/logos/app.svg";
import RegisterImg from "../../assets/images/form/register.svg";
import EmailIcon from "../../assets/images/form/email.png";

import { appRoutes } from "../../constants/routes";
import { appTheme } from "../../assets/js/theme";
import { userRolesOption, vendorOptions } from "../../constants/dropdown";

const { Content } = Layout;

export default function Register() {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();

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
            onFinish={console.log}
          >
            <Form.Item
              name="userType"
              label="I am a"
              rules={[{ required: true }]}
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
                prefix={<img src={EmailIcon} alt="email-icon" />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }, { min: 8 }]}
            >
              <PasswordWithStrengthMeter />
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

            <Form.Item className="center">
              <Button
                className="save-btn icon-animated-button"
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
              >
                Register
                <ArrowRightOutlined />
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

function UserTypeSelector({ value, onChange, ...rest }) {
  const setVendorType = ({ key }) => {
    const vendorType = find(vendorOptions, (opt) => opt.key == key);
    if (vendorType) {
      onChange(vendorType.value);
    }
  };

  return (
    <Radio.Group
      className="w-100"
      buttonStyle="solid"
      value={transformValue(value)}
      onChange={onChange}
      {...rest}
    >
      {map(userRolesOption, (option) => {
        return (
          <Radio.Button
            className="text-center"
            value={option.value}
            style={{ width: "50%" }}
          >
            {option.value === userRolesOption[0].value ? (
              option.label
            ) : (
              <Dropdown
                menu={{
                  items: vendorOptions,
                  selectable: true,
                  onClick: setVendorType,
                }}
              >
                <div>{`${option.label} ▼`}</div>
              </Dropdown>
            )}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );

  function transformValue(value) {
    if (!value) return;

    return value === userRolesOption[0].value
      ? userRolesOption[0].value
      : userRolesOption[1].value;
  }
}

const okRegex = new RegExp("(?=.{8,})", "gi");
const weakRegex = new RegExp("(?=.*[A-Z])", "gi");
const goodRegex = new RegExp("(?=.*[0-9])", "gi");
const strongRegex = new RegExp("(?=.*[^A-Za-z0-9])", "gi");
const colors = ["#ff4500", "#fade14", "#87d068", "#008000"];

function PasswordWithStrengthMeter({ value, ...rest }) {
  const percent = [okRegex, weakRegex, goodRegex, strongRegex]
    .map((regex) => {
      return !!value && regex.test(value);
    })
    .reduce((prev = 0, curr) => prev + curr);

  const strokeColor = { 0: colors[0] };
  new Array(percent).fill(null).map((val, i) => {
    const key = Math.round(((i + 1) / percent) * 100);
    strokeColor[key] = colors[i];
  });

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
