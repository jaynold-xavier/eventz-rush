import { useNavigate } from "react-router-dom";
import React from "react";
import { Avatar, Empty, List, Skeleton } from "antd";

import { vendors } from "../../../assets/js/mockData";
import { appRoutes } from "../../../constants/routes";
import ListItem from "./item/Index";

const loading = false;

export default function VendorsList({ ...rest }) {
  const navigate = useNavigate();

  const goToDetails = (id) => {
    navigate(appRoutes.vendors.details.replace("{id}", id));
  };

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
        xl: 4,
        xxl: 4,
      }}
      renderItem={renderItem}
      locale={{ emptyText: <Empty description="No Vendors available" /> }}
      {...rest}
    />
  );

  function renderItem(item) {
    return (
      <ListItem
        data={item}
        loading={loading}
        goToDetails={goToDetails}
        // actions={[
        //   <a key="list-loadmore-edit">edit</a>,
        //   <a key="list-loadmore-more">more</a>,
        // ]}
      />
    );
  }
}
