import { useNavigate } from "react-router-dom";
import React from "react";
import { Avatar, Empty, List, Button } from "antd";

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
        actions={[
          <Button
            className="rounded-0"
            size="large"
            type="primary"
            onClick={(e) => goToDetails(item.id)}
            block
          >
            Explore Me
          </Button>,
        ]}
      />
    );
  }
}
