import { create } from "ipfs-http-client";
import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, message, Select } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const { TextArea } = Input;
const client = create('https://ipfs.infura.io:5001/api/v0');
const { Option } = Select;
const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);
const items = ["nice", "lovely", "cool", "smart", "lazy", "cute", "pretty", "naughty"];

const children = []
items.forEach((v, i) => children.push(<Option key={v}>{v}</Option>));

const success = () => {
  message.success('Create a puppy profile successfully!');
};

const DogForm = (props) => {
  const {uploadDogCard} = props;
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState("");
  const [puppyName, setPuppyName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

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

  const profileSubmit = async() => {
    console.log("submit");
    if(voteContract!=='undefined'){
      try{
        const accounts = await web3.eth.getAccounts();
        const userAccount1 = accounts[0];
        console.log(userAccount1);
        console.log(tags);
        console.log(puppyName);
        console.log(birthday);
        console.log(description);
        console.log(urlArr);
        await voteContract.methods.createDogProfile(puppyName, gender, birthday, tags, description, urlArr).send({value: "100000000000000000", from: userAccount1})
        props.uploadDogCard();
        success();
      } catch (e) {
        console.log('Error, something wrong happened when creating a dog profile: ', e)
      }
    }
  };

  const handleSelectChange =(value)=> {
    console.log(`Selected: ${value}`);
    const list = String(value).split(",", 3);
    setTags([...list]);
  } 

  const puppyNameChange =(e)=> {
    console.log("puppyName: " + e.target.value);
    setPuppyName(e.target.value);
  }

  const genderChange =(e)=> {
    console.log("gender: " + e.target.value);
    setGender(e.target.value);
  }

  const birthdayChange =(moment, string)=> {
    console.log("birthday: " + string);
    setBirthday(string);
  }

  const descriptionChange =(e)=> {
    console.log("description: " + e.target.value);
    setDescription(e.target.value);
  }

  return (
    <div>
      <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
        >
          <Form.Item label="Puppy Name">
              <Input onChange={puppyNameChange}/>
          </Form.Item>
          <Form.Item label="Gender" name="gender">
              <Radio.Group onChange={genderChange}>
                <Radio.Button value="male">Male</Radio.Button>
                <Radio.Button value="Female">Female</Radio.Button>
              </Radio.Group>
          </Form.Item>
          <Form.Item label="Date of Birth">
              <DatePicker onChange={birthdayChange}/>
          </Form.Item>
          <Form.Item label="Tags">
            <Select
              mode="multiple"
              size="default"
              placeholder="Please select"
              onChange={handleSelectChange}
              style={{ width: '100%' }}
            >
              {children}
            </Select>
          </Form.Item>
          <Form.Item label="Description">
              <TextArea rows={5} showCount maxLength={300} onChange={descriptionChange} />
          </Form.Item>
      </Form>
      <form className="form" onSubmit={handleSubmit} style={{marginLeft: 30, marginTop: 10}}>
          <input type="file" name="data" onChange={retrieveFile} />
          <button type="submit" className="btn" >Upload file</button>
      </form>
      <Button type="primary" style={{marginTop: 20, marginLeft: 30}} onClick={profileSubmit}>Submit</Button>
    </div>  
  );
};

export default DogForm;