import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout, Image } from "antd";

import Error404Image from "../../../assets/images/errors/404.svg";

const { Content } = Layout;

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Layout
      prefixCls="page-error-layout center"
      style={{ "--error-color": "#5500df" }}
    >
      <div className="container center">
        <Content prefixCls="error-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-subtitle"> Page not found</h2>

          {/* <Divider /> */}

          <p className="error-message font-20">
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>

          <br />

          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={(e) => navigate("/")}
          >
            Go Back
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
  );
}
