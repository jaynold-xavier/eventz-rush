import { Card, Empty, List, Rate } from "antd";
import React from "react";

export default function ReviewsViewer({ dataSource, loading, ...rest }) {
  return (
    <List
      className="reviews-list"
      dataSource={dataSource}
      loading={loading}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4,
      }}
      renderItem={renderItem}
      locale={{ emptyText: <Empty description="No Reviews" /> }}
      {...rest}
    />
  );

  function renderItem(item) {
    const { rating, description } = item;

    return (
      <List.Item>
        <Card>
          <div className="text-center">
            <h3>{rating}</h3>
            <Rate value={rating} allowClear={false} disabled />
          </div>

          {description && (
            <div
              className="font-italic mt-3"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </Card>
      </List.Item>
    );
  }
}
