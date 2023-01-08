import React from "react";
import { Avatar, List, Skeleton } from "antd";

import { vendors } from "../../../assets/js/mockData";
import ListItem from "./Item";

export default function VendorsList({ ...rest }) {
  return (
    <List
      className="vendors-list"
      dataSource={vendors}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 3,
      }}
      renderItem={(data) => renderItem(data)}
      {...rest}
    />
  );
}

function renderItem(item, loading) {
  return (
    <ListItem
      data={item}
      loading={loading}
      // actions={[
      //   <a key="list-loadmore-edit">edit</a>,
      //   <a key="list-loadmore-more">more</a>,
      // ]}
    />
  );
}
