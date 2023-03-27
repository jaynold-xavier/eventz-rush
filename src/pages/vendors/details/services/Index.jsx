import { Empty, List, Typography } from "antd";
import React from "react";

import { formatAsCurrency } from "../../../../helpers/number";

export default function Services({ data }) {
  return (
    <List
      dataSource={data}
      renderItem={renderItem}
      locale={{
        emptyText: (
          <Empty
            description="No Services available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
    />
  );
}

const renderItem = (item) => {
  const { description, amount } = item;

  return (
    <List.Item className="pl-0 pr-0">
      <Typography.Paragraph ellipsis={{ tooltip: description }}>
        {description}
      </Typography.Paragraph>

      <strong>{amount ? formatAsCurrency(amount) : null}</strong>
    </List.Item>
  );
};
