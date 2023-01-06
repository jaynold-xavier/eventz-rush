import React from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Divider, Image } from "antd";

import Error404Image from "../../../assets/images/errors/404.svg";
import BlobShape from "../../../assets/images/shapes/shape-2.svg";

import { appRoutes } from "../../../constants/routes";

const { Content } = Layout;

export default function PageNotAuthorized() {
  return (
    <Layout
      className="page-error-layout center"
      style={{ "--error-color": "#d90505" }}
    >
      <div className="container center">
        <Content prefixCls="error-content">
          <h1 className="error-code mb-0">401</h1>
          <h2 className="error-subtitle"> Forbidden</h2>

          {/* <Divider /> */}

          <h3 className="error-message">
            This page is restricted to unregistered users or if your not logged
            in.
          </h3>

          <br />

          <Button type="primary" size="large" shape="round">
            <Link to={appRoutes.home}>Back Home</Link>
          </Button>
        </Content>

        <Content prefixCls="error-image" className="w-100 text-center">
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
