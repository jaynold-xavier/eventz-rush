import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Input,
  InputNumber,
  Layout,
  List,
  message,
  Row,
  Space,
  Switch,
  Tag,
  Typography,
  Upload,
} from "antd";
import { get, isEmpty, isNaN } from "lodash";

import { getUser, updateVendor } from "../../../../services/database";
import InlineEditor from "../../../../components/fields/inlineEditor/Index";
import RichTextEditor from "../../../../components/fields/richTextEditor/Index";
import { formatAsCurrency } from "../../../../helpers/number";
import { downloadResource } from "../../../../services/storage";
import useAuth from "../../../../hooks/useAuth";

const { Header, Content } = Layout;

const avatarProps = {
  shape: "circle",
  size: { xs: 100, sm: 130, md: 120, lg: 120, xl: 150, xxl: 150 },
  icon: <UserOutlined />,
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", (e) => {
    callback(e.target.result);
  });
  reader.readAsArrayBuffer(img);
  return reader;
};

const beforeUpload = (file) => {
  const isExcel =
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.oasis.opendocument.spreadsheet";

  if (!isExcel) {
    message.error("You can only upload XLS/XLSX/ODS file!");
  }

  return isExcel;
};

export default function VendorProfile({ user }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  const { setUser } = useAuth();

  const hostEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const vendorData = await getUser(hostEmail);
        setData(vendorData);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [hostEmail]);

  const updateData = (updatedData) => {
    setData((s) => {
      s = s || {};
      Object.assign(s, updatedData);
      return { ...s };
    });

    setUser(data);
    updateVendor(data.email, data);
  };

  const importExcel = (blobData) => {
    const workbook = read(blobData);
    const jsonData = utils.sheet_to_json(workbook.Sheets.Sheet1);

    const services = [];
    jsonData.forEach((item) => {
      const i = {
        description: item.Description,
        amount: item.Amount,
      };

      if (i.description && !isNaN(i.amount)) {
        services.push(i);
      }
    });

    setData((s) => {
      s = s || {};
      if (isEmpty(s.services)) {
        s.services = [];
      }
      s.services = [...s.services, ...services];
      return { ...s };
    });
  };

  const onImportExcel = ({ file }) => {
    if (file.status === "uploading") {
      return;
    }

    if (file.status === "done") {
      // Get this url from response in real world.
      getBase64(file.originFileObj, importExcel);
    }
  };

  return (
    <Layout prefixCls="vendor-profile-layout">
      <Header prefixCls="account-header" className="profile-header">
        <h5>My Profile</h5>
      </Header>

      <Content>
        <Card loading={loading}>
          <Row align="middle" gutter={[24, 24]}>
            <Col xs={24} sm={6} lg={4} md={4} xl={4} xxl={3}>
              <div className="d-inline-block position-relative">
                <Avatar
                  className="user-avatar"
                  src={get(data, "photoURL") || undefined}
                  {...avatarProps}
                />
              </div>
            </Col>

            <Col xs={24} sm={18} lg={20} md={20} xl={8} xxl={8}>
              <InlineEditor
                placeholder="Enter Title"
                value={get(data, "title")}
                onChange={(value) =>
                  updateData({
                    title: value || get(data, "userName") || get(data, "title"),
                  })
                }
                viewerTemplate={({ value, placeholder }) => (
                  <Typography.Title
                    className="user-name mb-0"
                    level={2}
                    ellipsis={{ tooltip: value }}
                    style={{ maxWidth: 300 }}
                  >
                    {value || placeholder}
                  </Typography.Title>
                )}
                editorTemplate={(props) => (
                  <Input
                    {...props}
                    size="large"
                    onChange={(e) => props.onChange(e.target.value)}
                    autoFocus
                  />
                )}
              />

              <Tag
                className="text-uppercase font-12 mr-0 mt-1"
                color="geekblue"
              >
                {get(data, "type")}
              </Tag>
            </Col>

            <Col xs={24} sm={24} lg={24} md={24} xl={9} xxl={9}>
              <Row>
                <Col span={12}>
                  <Space direction="vertical" size={12}>
                    <strong>Phone</strong>

                    <strong>Email</strong>

                    <strong>Years of Experience</strong>

                    <strong>Website</strong>
                  </Space>
                </Col>

                <Col span={12}>
                  <Space className="d-flex" direction="vertical" size={12}>
                    <InlineEditor
                      placeholder="Enter Phone Number"
                      value={get(data, "phoneNumber")}
                      onChange={(value) => updateData({ phoneNumber: value })}
                      viewerTemplate={({ value, placeholder }) => (
                        <div>{value || placeholder}</div>
                      )}
                      editorTemplate={(props) => (
                        <Input
                          {...props}
                          onChange={(e) => props.onChange(e.target.value)}
                          autoFocus
                        />
                      )}
                    />

                    <div>{get(data, "email")}</div>

                    <InlineEditor
                      placeholder="Enter your experience"
                      value={get(data, "experience")}
                      onChange={(value) => updateData({ experience: value })}
                      viewerTemplate={({ value, placeholder }) => (
                        <div>{value || placeholder}</div>
                      )}
                      editorTemplate={(props) => (
                        <InputNumber
                          {...props}
                          max={50}
                          precision={0}
                          onChange={(value) => props.onChange(value)}
                          autoFocus
                        />
                      )}
                    />

                    <InlineEditor
                      placeholder="Enter your website URL"
                      value={get(data, "websiteURL")}
                      onChange={(value) => updateData({ websiteURL: value })}
                      viewerTemplate={({ value, placeholder }) => (
                        <Typography.Text ellipsis={{ tooltip: value }}>
                          {value || placeholder}
                        </Typography.Text>
                      )}
                      editorTemplate={(props) => (
                        <Input
                          {...props}
                          onChange={(e) => props.onChange(e.target.value)}
                          autoFocus
                        />
                      )}
                    />
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <br />

        <Card title="Description" loading={loading}>
          <InlineEditor
            placeholder="Enter description"
            value={get(data, "description")}
            onChange={(value) => updateData({ description: value })}
            viewerTemplate={({ value, placeholder }) => (
              <div dangerouslySetInnerHTML={{ __html: value || placeholder }} />
            )}
            editorTemplate={(props) => (
              <RichTextEditor
                {...props}
                onChange={(value) => props.onChange(value)}
                autoFocus
              />
            )}
          />
        </Card>

        <br />

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} lg={24} md={24} xl={18} xxl={18}>
            <Card
              title="Services"
              loading={loading}
              extra={[
                <Button
                  icon={<CloudDownloadOutlined />}
                  onClick={(e) => {
                    downloadResource("services-template.ods");
                  }}
                >
                  Template
                </Button>,
                <Upload
                  onChange={onImportExcel}
                  customRequest={({ onSuccess, file }) => {
                    onSuccess("OK");
                  }}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                >
                  <Button
                    className="ml-2"
                    type="primary"
                    icon={<CloudUploadOutlined />}
                  >
                    Import
                  </Button>
                </Upload>,
              ]}
              bodyStyle={{ padding: "0 24px 1rem" }}
            >
              <ServicesWizard
                data={get(data, "services")}
                saveChanges={(services) => {
                  Object.assign(data, { services });
                  return updateVendor(data.email, data);
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={24} lg={24} md={24} xl={6} xxl={6}>
            <Card title="Settings" loading={loading}>
              <Row gutter={[12, 12]}>
                <Col span={12}>Show Contact Info</Col>
                <Col span={12}>
                  <Switch
                    checked={get(data, "configurations.showContactInfo")}
                    onChange={(value) => {
                      const showServices = get(
                        data,
                        "configurations.showServices"
                      );
                      updateData({
                        configurations: {
                          showContactInfo: value,
                          showServices,
                        },
                      });
                    }}
                  />
                </Col>

                <Col span={12}>Show Services</Col>
                <Col span={12}>
                  <Switch
                    checked={get(data, "configurations.showServices")}
                    onChange={(value) => {
                      const showContactInfo = get(
                        data,
                        "configurations.showContactInfo"
                      );
                      updateData({
                        configurations: {
                          showServices: value,
                          showContactInfo,
                        },
                      });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

function ServicesWizard({ data, saveChanges }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!isEmpty(data)) {
      setServices(data);
    }
  }, [data]);

  const addItem = () => {
    setServices((s) => {
      return [
        ...s,
        {
          description: "",
          amount: undefined,
        },
      ];
    });
  };

  const onChange = (index, data) => {
    setServices((s) => {
      s = s || [];
      Object.assign(s[index], data);
      return [...s];
    });
  };

  const removeItem = (index) => {
    setServices((s) => {
      s = s || [];
      s.splice(index, 1);
      return [...s];
    });
  };

  const onSave = async (e) => {
    await saveChanges(
      services.map((s, i) => {
        s.id = i.toString();
        return s;
      })
    );
    message.success("Services saved!");
  };

  return (
    <List
      header={
        <Button icon={<PlusOutlined />} onClick={addItem}>
          Add Item
        </Button>
      }
      dataSource={services}
      renderItem={(...props) => renderItem(...props, onChange, removeItem)}
      locale={{
        emptyText: (
          <Empty
            description="No Services added"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      footer={
        <Button className="float-right" type="primary" onClick={onSave}>
          Save
        </Button>
      }
    />
  );
}

const renderItem = (item, index, onChange, removeItem) => {
  const { description, amount } = item;

  const descriptionRender = (
    <InlineEditor
      placeholder="Enter description"
      value={description}
      onChange={(value) => onChange(index, { description: value })}
      viewerTemplate={({ value, placeholder }) => (
        <Typography.Paragraph ellipsis={{ tooltip: value }}>
          {value || placeholder}
        </Typography.Paragraph>
      )}
      editorTemplate={(props) => (
        <Input.TextArea
          {...props}
          onChange={(e) => props.onChange(e.target.value)}
          autoFocus
        />
      )}
    />
  );

  const amountRender = (
    <InlineEditor
      className="ml-2 mr-2"
      placeholder="Enter Amount"
      value={amount}
      onChange={(value) => onChange(index, { amount: value })}
      viewerTemplate={({ value, placeholder }) => (
        <strong>{value ? formatAsCurrency(value) : placeholder}</strong>
      )}
      editorTemplate={(props) => (
        <InputNumber
          {...props}
          precision={2}
          onChange={(value) => props.onChange(value)}
          autoFocus
        />
      )}
    />
  );

  return (
    <List.Item className="pl-0 pr-0">
      <List.Item.Meta description={descriptionRender} />

      {amountRender}

      <Button
        type="link"
        icon={<DeleteOutlined />}
        onClick={(e) => removeItem(index)}
        danger
      />
    </List.Item>
  );
};
