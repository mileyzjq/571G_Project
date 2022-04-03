import { create } from "ipfs-http-client";
import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Upload, Select } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const client = create('https://ipfs.infura.io:5001/api/v0');
const { Option } = Select;

class DogForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false,
      urlArr: "",
      file: null,
      userAccount: this.props.userAccount,
      voteContract: this.props.voteContract,
      owner: "",
    };
  }

  retrieveFile = (e) => {
    console.log("account: " + this.state.userAccount);
    console.log("vote " + this.state.voteContract);
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      this.setState({
        file: reader.result,
      });
    }
    e.preventDefault();  
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("miley");
      const created = await client.add(this.state.file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      this.setState({
        urlArr: url,
      });
      console.log("url: " + this.state.urlArr);     
    } catch (error) {
      console.log(error.message);
    }
  };

  handleChange =(value)=> {
    console.log(`Selected: ${value}`);
  } 

  ownerChange =(e)=> {
    console.log(e.target.value);
    this.setState({
      owner: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
          >
            <Form.Item label="Owner">
                <Input onChange={this.ownerChange}/>
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
                onChange={this.handleChange}
                style={{ width: '100%' }}
              >
                {this.children}
              </Select>
            </Form.Item>
            <Form.Item label="Description">
                <TextArea rows={4} showCount maxLength={200} onChange={this.onChange} />
            </Form.Item>
        </Form>
        <form className="form" onSubmit={this.handleSubmit}>
            <input type="file" name="data" onChange={this.retrieveFile} />
            <button type="submit" className="btn">Upload file</button>
        </form>
        <Button type="primary" style={{marginTop: 10}}>Submit</Button>
      </div>  
    );
  }
};

export default DogForm;