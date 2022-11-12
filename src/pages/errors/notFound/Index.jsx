import React from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Divider, Image } from "antd";

import Error404Image from "../../../assets/images/errors/404.svg";
import BlobShape from "../../../assets/images/shapes/shape-2.svg";

import { appRoutes } from "../../../constants/routes";

const { Content } = Layout;

export default function PageNotFound() {
  return (
    <Layout prefixCls="page-error-layout center">
      <div className="container center">
        <Content>
          <h1 className="error-code mb-0">404 Error</h1>
          <h2 className="error-subtitle mb-0"> Page not found</h2>

          <Divider />

          <h3 className="error-message">
            Sorry, the page your looking for could not be found
          </h3>

          <br />

          <Button type="primary" size="large">
            <Link to={appRoutes.home}>Back Home</Link>
          </Button>
        </Content>

        <section className="error-image">
          <Image
            alt="error-404"
            src={Error404Image}
            width="100%"
            preview={false}
          />

          <img alt="blob-shape" src={BlobShape} width="100%" />
        </section>
      </div>
    </Layout>
  );
}
