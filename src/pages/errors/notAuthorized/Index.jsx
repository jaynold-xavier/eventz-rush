import React from "react";
import { Button, Layout, Image, ConfigProvider } from "antd";

import Error401Image from "../../../assets/images/errors/401.svg";
import BlobShape from "../../../assets/images/shapes/shape-2.svg";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../../../constants/routes";

const { Content } = Layout;

const hueColor = 0;

export default function PageNotAuthorized() {
  const navigate = useNavigate();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: `hsl(${hueColor}, 100%, 70%)`,
          colorLink: "#fff",
        },
      }}
    >
      <Layout
        className="page-error-layout center"
        style={{ "--error-color": hueColor }}
      >
        <div className="container center">
          <Content prefixCls="error-content">
            <h1 className="error-code mb-0">401</h1>
            <h2 className="error-subtitle"> Forbidden</h2>

            <p className="error-message font-20 mt-3">
              Sorry, you are not allowed to access this page unless your logged
              in with valid credentials and privileges.
            </p>

            <br />

            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={(e) => navigate(appRoutes.home)}
            >
              Back To Home
            </Button>
          </Content>

          <Content prefixCls="error-image">
            <Image
              alt="error-401"
              src={Error401Image}
              width="35rem"
              preview={false}
            />

            {/* <img alt="blob-shape" src={BlobShape} width="100%" /> */}
          </Content>
        </div>
      </Layout>
    </ConfigProvider>
  );
}
