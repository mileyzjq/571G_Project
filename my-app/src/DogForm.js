import { create } from "ipfs-http-client";
import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Upload, Select } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';
const { TextArea } = Input;
const client = create('https://ipfs.infura.io:5001/api/v0');
const { Option } = Select;
const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);
const items = ["nice", "lovely", "cool", "smart", "loser", "cute", "pretty", "naughty"];

const children = []
items.forEach((v, i) => children.push(<Option key={v}>{v}</Option>));

class DogForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voteModal: false,
      formVisible: false,
      urlArr: "",
      file: null,
      userAccount: this.props.userAccount,
      voteContract: this.props.voteContract,
      owner: "",
      puppyName: "",
      gender: "",
      birthday: "",
      description: "",
      tags:[],
    };
  }
  // getDog =async()=> {
  //   if(this.state.voteContract!=='undefined'){
  //     try{
  //       // let dogs = await this.state.voteContract.methods.getDogs().call({from: this.state.userAccount});
  //       // console.log("dog array: " + dogs);
  //       await this.state.voteContract.methods.getDogByIndex(0).call({from: this.state.userAccount}).then(function(result){
  //         console.log(result[0]);
  //         console.log(result[1]);
  //       });
  //     } catch (e) {
  //       console.log('Error, deposit: ', e)
  //     }
  //   }
  // }
  getDog =async()=> {
    if(this.state.voteContract!=='undefined'){
      try{
        let dogs = await this.state.voteContract.methods.getDogs().call({from: this.state.userAccount});
        console.log("dog array: " + dogs[0]);
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
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

  profileSubmit = async() => {
    console.log("submit");
    if(this.state.voteContract!=='undefined'){
      try{
        console.log("tags: " + children);
        console.log("pictures: " + this.state.urlArr);
        console.log("contract-state: " + this.state.voteContract);
        console.log("contract-props: " + this.state.voteContract);
        await this.state.voteContract.methods.createDogProfile(this.state.puppyName, this.state.gender, this.state.birthday, this.state.tags, this.state.description, this.state.urlArr).send({value: "100000000000000000", from: this.state.userAccount, gas: 1000000})
      } catch (e) {
        console.log('Error, something wrong happened when creating a dog profile: ', e)
      }
    }
    this.setState({
      voteModal: false,
    });
  };

  handleSelectChange =(value)=> {
    console.log(`Selected: ${value}`);
    const list = String(value).split(",", 3);
    this.setState({
      tags: list,
    });
  } 

  ownerChange =(e)=> {
    console.log("owner: " + e.target.value);
    this.setState({
      owner: e.target.value,
    });
  }

  puppyNameChange =(e)=> {
    console.log("puppyName: " + e.target.value);
    this.setState({
      puppyName: e.target.value,
    });
  }

  genderChange =(e)=> {
    console.log("gender: " + e.target.value);
    this.setState({
      gender: e.target.value,
    });
  }

  birthdayChange =(moment, string)=> {
    // console.log("dateString: " + moment);
    console.log("birthday: " + string);
    this.setState({
      birthday: string,
    });
  }
  descriptionChange =(e)=> {
    console.log("description: " + e.target.value);
    this.setState({
      description: e.target.value,
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
                <Input onChange={this.puppyNameChange}/>
            </Form.Item>
            <Form.Item label="Gender" name="gender">
                <Radio.Group>
                <Radio.Button value="male" onChange={this.genderChange}>Male</Radio.Button>
                <Radio.Button value="Female" onChange={this.genderChange}>Female</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Date of Birth">
                <DatePicker onChange={this.birthdayChange}/>
            </Form.Item>
            <Form.Item label="Tags">
              <Select
                mode="multiple"
                size="default"
                placeholder="Please select"
                onChange={this.handleSelectChange}
                style={{ width: '100%' }}
              >
                {children}
              </Select>
            </Form.Item>
            <Form.Item label="Description">
                <TextArea rows={4} showCount maxLength={200} onChange={this.descriptionChange} />
            </Form.Item>
        </Form>
        <form className="form" onSubmit={this.handleSubmit}>
            <input type="file" name="data" onChange={this.retrieveFile} />
            <button type="submit" className="btn" onClick={this.getDog}>Upload file</button>
        </form>
        <Button type="primary" style={{marginTop: 10}} onClick={this.profileSubmit}>Submit</Button>
      </div>  
    );
  }
};

export default DogForm;