import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import ImgCrop from "antd-img-crop";
import React from "react";

import { appTheme } from "../../../assets/js/theme";
import { USER_ROLES } from "../../../constants/app";
import { getUserRole } from "../../../helpers/auth";
import useAuth from "../../../hooks/useAuth";
import { updateHost, updateVendor } from "../../../services/database";
import { ImageUploader } from "../../fields/upload/Index";

export default function UserAvatar({ src, hideUpload = false, ...rest }) {
  const { user, setUser } = useAuth();

  const onChange = ({ file }) => {
    setUser((s) => ({ ...s, photoURL: file.thumbUrl }));

    const role = getUserRole(user);
    if (role === USER_ROLES.vendor.key) {
      updateVendor(user.email, { photoURL: file.thumbUrl || "" });
    } else {
      updateHost(user.email, { photoURL: file.thumbUrl || "" });
    }
  };

  const avatarRender = (
    <Avatar
      src={src || undefined}
      icon={<UserOutlined style={{ color: "#fff", fontSize: "100%" }} />}
      style={{ backgroundColor: appTheme.colorPrimary }}
      {...rest}
    />
  );

  if (hideUpload) {
    return avatarRender;
  } else {
    return (
      <Badge
        className="avatar-upload"
        count={<UploadAvatar onChange={onChange} />}
        offset={[-15, -15]}
      >
        {avatarRender}
      </Badge>
    );
  }
}

function UploadAvatar({ value, onChange, ...rest }) {
  return (
    <>
      <ImgCrop cropShape="round">
        <ImageUploader
          className="image-uploader"
          listType="picture"
          accept="image/*"
          fileList={value}
          onChange={onChange}
          maxCount={1}
          showUploadList={false}
          {...rest}
        >
          <CameraOutlined style={{ fontSize: "1rem" }} />
        </ImageUploader>
      </ImgCrop>
    </>
  );
}
