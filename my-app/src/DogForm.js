import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Upload } from 'antd';
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
        <Form.Item label="Description">
            <TextArea rows={4} showCount maxLength={200} onChange={onChange} />
        </Form.Item>
        <Form.Item
            name="upload"
            label="Upload"
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