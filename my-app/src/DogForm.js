import { create } from "ipfs-http-client";
import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Upload, Select } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const client = create('https://ipfs.infura.io:5001/api/v0');

const DogForm = (vote, web3, userAccount) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState("");

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile((reader.result));
    }
    console.log(reader.result);
    e.preventDefault();  
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("miley");
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrlArr(url); 
      console.log("url: " + urlArr);     
    } catch (error) {
      console.log(error.message);
    }
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
    <div>
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
      </Form>
      <form className="form" onSubmit={handleSubmit}>
          <input type="file" name="data" onChange={retrieveFile} />
          <button type="submit" className="btn">Upload file</button>
      </form>
      <Button type="primary">Submit</Button>
    </div>  
  );
};

export default DogForm;