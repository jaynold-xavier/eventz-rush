import React from "react";
import { Skeleton, Space } from "antd";

export default function TabHeader({ title = null, icon = null, loading }) {
  return (
    <Space>
      {loading ? <Skeleton.Avatar size={25} active /> : icon}
      
      {loading ? (
        <Skeleton.Button shape="square" size={25} block active />
      ) : (
        <span className="hide-xs">{title}</span>
      )}
    </Space>
  );
}
