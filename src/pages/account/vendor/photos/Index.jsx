import React, { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import { get, map } from "lodash";

import { getUser, updateVendor } from "../../../../services/database";
import { ImageUploader } from "../../../../components/fields";

const { Header, Content } = Layout;

export default function VendorPhotos({ user }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState([]);

  const hostEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const vendorData = await getUser(hostEmail);
        vendorData.photos = map(get(vendorData, "photos"), (url, index) => {
          return {
            uid: index.toString(),
            name: "image-" + index,
            thumbUrl: url,
          };
        });
        setData(vendorData);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [hostEmail]);

  const onSave = (fileList) => {
    const photos = map(fileList, (file) => {
      return file.thumbUrl || get(file.originFileObj, "thumbUrl");
    }).filter((val) => val);

    updateVendor(hostEmail, {
      ...data,
      photos,
    });

    setData((s) => ({ ...s, photos: fileList }));
  };

  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>Upload</div>
      <div>Photo</div>
    </div>
  );

  return (
    <Layout prefixCls="vendor-dashboard-layout">
      <Header prefixCls="account-header" className="dashboard-header">
        <h5>My Photos</h5>
      </Header>

      <Content>
        <Spin spinning={loading}>
          <ImageUploader
            className="image-uploader"
            listType="picture-card"
            accept="image/*"
            maxCount={50}
            value={get(data, "photos")}
            onChange={({ fileList }) => onSave(fileList)}
          >
            {uploadButton}
          </ImageUploader>
        </Spin>
      </Content>
    </Layout>
  );
}
