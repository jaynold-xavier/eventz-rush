import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout, Image, ConfigProvider } from "antd";

import Error404Image from "../../../assets/images/errors/404.svg";
import { appRoutes } from "../../../constants/routes";

const { Content } = Layout;

const hueColor = 260;

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: `hsl(${hueColor}, 100%, 50%)`,
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
            <h1 className="error-code">404</h1>
            <h2 className="error-subtitle"> Page not found</h2>

            <p className="error-message font-20 mt-3">
              The page you are looking for might have been removed had its name
              changed or is temporarily unavailable.
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
              alt="error-404"
              src={Error404Image}
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
