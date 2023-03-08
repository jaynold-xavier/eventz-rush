import React from "react";
import { Card, ConfigProvider, Image, Empty, Spin } from "antd";
import { first, isEmpty } from "lodash";

import { appTheme } from "../../../assets/js/theme";
import BlobImg3 from "../../../assets/images/shapes/shape-3.svg";
import usePaginatedData from "../../../hooks/usePaginatedData";

const emptyRender = (
  <Empty description="No Events" image={Empty.PRESENTED_IMAGE_SIMPLE} />
);

export default function ScrollableCard({
  title,
  resource,
  constraints,
  blobImg = BlobImg3,
  hasMore,
  children,
  ...rest
}) {
  const { data, loadNext, loading } = usePaginatedData({
    table: resource,
    constraints,
    pageSize: 1,
  });

  const render = () => {
    if (loading) {
      return <Spin spinning={loading} />;
    } else {
      if (isEmpty(data)) {
        return emptyRender;
      } else {
        return children && children(first(data));
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorBgContainer: appTheme.colorPrimary, colorText: "#fff" },
      }}
    >
      <Card className="scrollable-card" {...rest}>
        <span className="title">{title}</span>

        {render()}

        <Image
          className="blob"
          rootClassName="blob-img"
          src={blobImg}
          preview={false}
          alt="blob"
        />
      </Card>
    </ConfigProvider>
  );
}
