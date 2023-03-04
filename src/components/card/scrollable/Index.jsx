import React from "react";
import { Card, ConfigProvider, Image } from "antd";

import { appTheme } from "../../../assets/js/theme";
import BlobImg3 from "../../../assets/images/shapes/shape-3.svg";

export default function ScrollableCard({ total, hasMore, children, ...rest }) {
  return (
    <ConfigProvider
      theme={{
        token: { colorBgContainer: appTheme.colorPrimary, colorText: "#fff" },
      }}
    >
      <Card className="scrollable-card" {...rest}>
        {children}

        <Image
          className="blob"
          rootClassName="blob-img"
          src={BlobImg3}
          width="15rem"
          preview={false}
          alt="blob"
        />
      </Card>
    </ConfigProvider>
  );
}
