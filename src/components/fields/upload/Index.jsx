import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { message, Upload } from "antd";
import { get } from "lodash";

import { uploadResource } from "../../../services/storage";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }

  return isJpgOrPng && isLt2M;
};

export function ImageUploader({
  maxCount,
  onChange,
  value,
  children,
  ...rest
}) {
  const [loading, setLoading] = useState(false);

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    try {
      setLoading(true);
      const url = await uploadResource(file);
      if (url) {
        file.thumbUrl = url;
      }
      onSuccess("Ok");
    } catch (err) {
      console.log("Error upload banner: ", err);
      onError({ err });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (args) => {
    args.fileList = args.fileList.filter((f) => {
      if (f.status === "done") {
        return f.thumbUrl && f.thumbUrl.includes("http");
      }

      if (f.status === "uploading") {
        return true;
      }

      return false;
    });

    onChange(args);
  };

  let uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (children !== undefined) {
    if (typeof children === "function") {
      uploadButton = children(loading, value);
    } else {
      uploadButton = children;
    }
  }

  return (
    <Upload
      className="image-uploader"
      listType="picture-card"
      accept="image/*"
      fileList={value}
      onChange={onFileChange}
      customRequest={uploadImage}
      maxCount={maxCount}
      beforeUpload={beforeUpload}
      {...rest}
    >
      {get(value, "length") >= maxCount ? null : uploadButton}
    </Upload>
  );
}
