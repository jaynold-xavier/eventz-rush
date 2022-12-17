import React from "react";
import { Avatar, List, Skeleton } from "antd";

import { vendors } from "../../../assets/js/mockData";

export default function VendorsList({ ...rest }) {
  return <List dataSource={vendors} renderItem={renderItem} {...rest} />;
}

function renderItem(item) {
  const { id, email, title, details, phone, profilePicUrl } = item;

  return (
    <List.Item
      className="pl-0 pr-0"
      // actions={[
      //   <a key="list-loadmore-edit">edit</a>,
      //   <a key="list-loadmore-more">more</a>,
      // ]}
    >
      <Skeleton avatar title={false} loading={item.loading} active>
        <List.Item.Meta
          avatar={<Avatar src={profilePicUrl} shape="square" size={126} />}
          title={title}
          description={<div dangerouslySetInnerHTML={{ __html: details }} />}
        />

        <div>content</div>
      </Skeleton>
    </List.Item>
  );
}
