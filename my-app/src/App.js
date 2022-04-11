import { Tabs, Button, Avatar, Modal, Input, Divider, message, InputNumber } from 'antd';
import LeaderBoard from './LeaderBoard';
import MyDog from './MyDog';
import Home from './Home';
import 'antd/dist/antd.css';
import Icon from './image/icon.webp';
import React, { useState } from 'react';
// import Web3 from 'web3';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const { TabPane } = Tabs;

function iconTitle() {
  return (
    <span style={{marginLeft:20, marginRight: 100}}>
      <Avatar src={Icon} style={{marginRight:10, color:'#1890FF', backgroundColor: '#1890FF'}} />
      <a className='website-title'>PuppyVote</a>
    </span>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voteModal: false,
      userAccount: null,
      contractAccount: null,
      voteContract: null,
      web3: null,
      buyVoteNumber: 3,
      voteNumber: 6,
      dogInfo: [],
      isUpdated: false,
      isUpdatedVotes: false,
    };
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  callback = key => {
    console.log(key);
  }
  
  OperationsSlot = () => {
    return {
      left: iconTitle(),
      right: <span>
          <Button type="primary" style={{marginRight: 20}} onClick={this.getAccount}>Connect Wallet</Button>
          <Button type="primary" style={{marginRight: 20}} onClick={this.handleShowVote}>Buy Vote</Button>
          {/*<Button type="primary" style={{marginRight: 20}} onClick={this.getVote}>Info</Button>*/}
          </span>
    };
  };

  offSet = () => {
    return {
      left: <div style={{marginRight:100}}> </div>,
    };
  }

  loadBlockchainData= async() => {
    console.log("hello");
    if(typeof window.ethereum!=='undefined'){
      console.log("ether")
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      console.log("netId " + netId);
      //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({
          userAccount: accounts[0], balance: balance, web3: web3
        })
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const vote = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address)
        console.log(vote)
        const dBankAddress =  PuppyVote.networks[netId].address
        this.setState({voteContract: vote, contractAccount: dBankAddress})
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    } else {
      window.alert('Please install MetaMask')
    }
  }

  voteInfo = (vote_number) => {
    message.info('You currently have ' +  vote_number + ' vote(s)');
  };

  buyVoteInfo = (vote_number) => {
    message.success('You purchase ' +  vote_number + ' vote(s) successfully!');
  };
  

  getVote =async()=> {
    console.log("contract address " + this.state.contractAccount);
    console.log("contract balance: " + await this.state.web3.eth.getBalance(this.state.contractAccount));
    if(this.state.voteContract!=='undefined'){
      try{
        const account = this.state.userAccount;
        console.log("hello " + this.state.voteContract);
        let vote_number = await this.state.voteContract.methods.getUserVote(account).call();
        let admin = await this.state.voteContract.methods.getAdmin().call();
        console.log("dog vote: " + vote_number);
        console.log("admin: " + admin);
        this.voteInfo(vote_number);
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }

  inputNumberChange = (value) => {
    console.log("onchange: " + value);
    this.setState({
      buyVoteNumber: value,
    });
  }
  
  handleVoteOk = async() => {
    // console.log("hello");
    console.log("contract balance: " + await this.state.web3.eth.getBalance(this.state.contractAccount));
    // console.log("bank: " + this.state.contractAccount);
    if(this.state.voteContract!=='undefined'){
      console.log("value " + this.state.buyVoteNumber);
      console.log("user account: " + this.state.userAccount);
      const number = this.state.buyVoteNumber;
      const value = number * 10**17;
      try{
        await this.state.voteContract.methods.buyVote(number).send({value: value.toString(), from: this.state.userAccount})
        this.buyVoteInfo(number);
        this.updateVotes();
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
    this.setState({
      voteModal: false,
    });
  };

  handleVoteCancel = () => {
    this.setState({
      voteModal: false,
    });
  };

  handleShowVote = () => {
    this.setState({
      voteModal: true,
    });
  };

  getAccount =async()=> {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    this.setState({
      userAccount: account,
    });
    console.log(account);
    this.loadBlockchainData();
  }

  updateDogCard =()=> {
    console.log("update");
    this.setState({
      isUpdated: !this.state.isUpdated,
    });
  }

  updateVotes =()=> {
    console.log("update");
    this.setState({
      isUpdatedVotes: !this.state.isUpdatedVotes,
    });
  }

  render() {
    const {userAccount, voteContract, isUpdatedVotes, isUpdated} = this.state;
    
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={this.OperationsSlot()} tabBarStyle={{backgroundColor: '#f7f7f7'}}>
          <TabPane tab="Home" key="1">
            <div>
              <Home updateDogCard={this.updateDogCard} updateVotes={this.updateVotes}/>
            </div>
          </TabPane>
          <TabPane tab="LeaderBoard" key="2">
              <LeaderBoard userAccount={userAccount} voteContract={voteContract} updateVotes={this.updateVotes} />
          </TabPane>
          <TabPane tab="My Dogs" key="3">
              <MyDog isUpdated={isUpdated} isUpdatedVotes={isUpdatedVotes} userAccount={userAccount}/>
          </TabPane>
        </Tabs>
        <Modal title="Buy Vote" visible={this.state.voteModal} onOk={this.handleVoteOk} onCancel={this.handleVoteCancel}>
          <p>How many votes do you want to buy? </p>
          <p>Each vote costs 0.1 Ether.</p>
          <InputNumber min={1} max={10} onChange={this.inputNumberChange} />
        </Modal>
      </div>
    );
  }
  
};

export default App;