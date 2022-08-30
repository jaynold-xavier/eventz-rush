import React from "react";
import { Button, Result } from "antd";

export default function PageNotAuthorized() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary">Back Home</Button>}
    />
  );
}
