import './App.css';
import 'antd/dist/antd.css';
import { Divider, Button, Modal, Skeleton, Avatar, Card, Tabs } from 'antd';
import DogCard from './DogCard';
import React from 'react';
import DogForm from './DogForm';
import dogImage1 from './image/dog1.jpeg';
import dogImage2 from './image/dog2.webp';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract1 = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false,
      formVisibleDelete: false,
      userAccount: this.props.userAccount,
      dogInfo: [],
      puppyName: "",
    };
  }

  componentDidMount() {
    this.getDogInfo();
    //this.createDogElement();
  }

  getDogInfo = async() => {
    console.log(this.state.voteContract);
    const {userAccount} = this.props;
    if(voteContract1!=='undefined'){
      try{
        console.log(userAccount);
        const dogs = await voteContract1.methods.getDogs().call({from: userAccount});
        console.log("dog array: " + dogs[0]);
        console.log("dog array length: " + dogs.length);
        this.setState({
          dogInfo: [...dogs],
        });
        //setDogsInfo([...dogs]);
        //getTableData();
      } catch (e) {
        console.log('Error, getDog: ', e)
      }
    }
  }

  showForm = () => {
    const {userAccount} = this.props;
    console.log("userAccount: "+userAccount);
    this.setState({
      formVisible: true,
    });
  };

  hideForm = () => {
    this.setState({
      formVisible: false,
    });
  };

  showFormDelete= () => {
    const {userAccount} = this.props;
    console.log("userAccount: "+ userAccount);
    this.setState({
      formVisibleDelete: true,
    });
  };

  hideFormDelete = () => {
    this.setState({
      formVisibleDelete: false,
    });
  };

  onOkWithDelete = async() => {
    const accounts = await web3.eth.getAccounts();
    const userAccount1 = accounts[0];
    this.setState({
      formVisibleDelete: false,
    });
    console.log("account： ", userAccount1);
    console.log("dog array length before delete: " + this.state.dogInfo.length);

    if(voteContract1!=='undefined'){
      try{
        await voteContract1.methods.deleteDogProfile(this.state.puppyName, userAccount1).call();
        console.log("dog array length after delete: " + this.state.dogInfo.length);
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }

  callback = key => {
    console.log(key);
  }

  getDogLines =()=> {
    const {dogInfo, voteContract} = this.state;
    return (<div class="dog-card-container">
      {
        dogInfo.map(dog => {return (<DogCard class="dog-card-item" dogInfo={[...dog]} voteContract={voteContract}/>)})
      }
    </div>);
  }

  uploadDogCard =()=> {
    this.getDogInfo();
  }

  deleteByPuppyName = async(e)=> {
    console.log("puppyName: " + e.target.value);
    this.setState({
      puppyName: e.target.value,
    });
  }

  render() {
    const {formVisible, formVisibleDelete} = this.state;
    const {userAccount, voteContract} = this.props;
    
    return (
      <div className="App-setting">
        <div className='title-container'>
          <h1 style={{fontWeight: 'bold', textAlign: 'center'}}>Vote for your Favourite puppies! </h1>
          <Button type="primary" style={{display: 'flex'}} onClick={() => this.showForm()}>Upload Puppies</Button>
          <br></br>
          <Button type="primary" style={{display: 'flex'}} onClick={() => this.showFormDelete()}>Delete Puppies</Button>
        </div>
        <Modal
          title={<a>Create Dog Profile</a>}
          visible={formVisible}
          onOk={this.hideForm}
          onCancel={this.hideForm}
        >
          <DogForm userAccount={userAccount} voteContract={voteContract} uploadDogCard={this.uploadDogCard}/>
        </Modal>
        
          <Modal
          title={<a>Delete Dog Profile</a>}
          visible={formVisibleDelete}
          onOk={this.onOkWithDelete}
          onCancel={this.hideFormDelete}
        >
          <input type="text" name="puppyName" onChange={this.deleteByPuppyName} />
                  </Modal>
        {this.getDogLines()}
      </div>
    );
  }
}

export default Home;