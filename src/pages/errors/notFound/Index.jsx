import React from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Divider, Image } from "antd";

import Error404Image from "../../../assets/images/errors/404.svg";
import BlobShape from "../../../assets/images/shapes/shape-2.svg";

import { appRoutes } from "../../../constants/routes";

const { Content } = Layout;

export default function PageNotFound() {
  return (
    <Layout
      prefixCls="page-error-layout center"
      style={{ "--error-color": "#5500df" }}
    >
      <div className="container center">
        <Content prefixCls="error-content">
          <h1 className="error-code mb-0">404</h1>
          <h2 className="error-subtitle"> Page not found</h2>

          {/* <Divider /> */}

          <h3 className="error-message">
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </h3>

          <br />

          <Button type="primary" size="large" shape="round">
            <Link to={appRoutes.home}>Go Back</Link>
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
