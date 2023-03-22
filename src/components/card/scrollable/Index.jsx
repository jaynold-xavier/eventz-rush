import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { Card, ConfigProvider, Image, Empty, Spin, Button } from "antd";
import { isEmpty } from "lodash";

import { appTheme, navLinkTheme } from "../../../assets/js/theme";
import BlobImg3 from "../../../assets/images/shapes/shape-3.svg";
import usePaginatedData from "../../../hooks/usePaginatedData";

const emptyRender = (
  <Empty description="No Events" image={Empty.PRESENTED_IMAGE_SIMPLE} />
);

export default function ScrollableCard({
  resource,
  constraints,
  blobImg = BlobImg3,
  transformData,
  children,
  ...rest
}) {
  const { data, loadPrev, loadNext, loading, currentPage, hasMore, setReload } =
    usePaginatedData({
      table: resource,
      transformData,
      constraints,
      pageSize: 1,
    });

  const canGoBack = hasMore || !isEmpty(data);
  const canGoNext = hasMore && !isEmpty(data);

  const render = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Spin spinning={loading} />
        </div>
      );
    } else {
      if (isEmpty(data)) {
        return emptyRender;
      } else {
        const currentData = data[currentPage - 1];
        if (!isEmpty(currentData)) {
          return children && children(data[currentPage - 1], setReload);
        } else {
          return emptyRender;
        }
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorLink: "#fff",
          colorBgContainer: appTheme.colorPrimary,
          colorText: "#fff",
          colorTextHeading: "#fff",
          ...navLinkTheme,
        },
      }}
    >
      <Card className="scrollable-card" headStyle={{ border: 0 }} {...rest}>
        {canGoBack && currentPage > 1 && (
          <span className="prev-btn">
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={(e) => loadPrev()}
            />
          </span>
        )}

        {render()}

        <Image
          className="blob"
          rootClassName="blob-img"
          src={blobImg}
          preview={false}
          alt="blob"
        />

        {canGoNext && currentPage >= 1 && (
          <span className="next-btn">
            <Button
              type="link"
              icon={<RightOutlined />}
              onClick={(e) => loadNext()}
            />
          </span>
        )}
      </Card>
    </ConfigProvider>
  );
}
