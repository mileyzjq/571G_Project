import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Upload, Select } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const DogForm = () => {
  const [form] = Form.useForm();

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onChange = ({});

  const { Option } = Select;

  const items = ["nice", "lovely", "cool", "smart", "loser", "cute", "pretty", "naughty"];

  const children = []
  items.forEach((v, i) => children.push(<Option key={v}>{v}</Option>));

  function handleChange(value) {
    console.log(`Selected: ${value}`);
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
    >
        <Form.Item label="Owner">
            <Input />
        </Form.Item>
        <Form.Item label="Puppy Name">
            <Input />
        </Form.Item>
        <Form.Item label="Gender" name="gender">
            <Radio.Group>
            <Radio.Button value="male">Male</Radio.Button>
            <Radio.Button value="Female">Female</Radio.Button>
            </Radio.Group>
        </Form.Item>
        <Form.Item label="Date of Birth">
            <DatePicker />
        </Form.Item>
        <Form.Item label="Tags">
          <Select
            mode="multiple"
            size="default"
            placeholder="Please select"
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            {children}
          </Select>
        </Form.Item>
        <Form.Item label="Description">
            <TextArea rows={4} showCount maxLength={200} onChange={onChange} />
        </Form.Item>
        <Form.Item
            name="upload"
            label="Dog Photo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
        >
            <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
        </Form.Item>
    </Form>
  );
};

export default DogForm;