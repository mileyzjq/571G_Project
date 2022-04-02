import { Tabs, Button, Avatar, Modal, Input, Divider, Card, Skeleton } from 'antd';
import LeaderBoard from './LeaderBoard';
import Home from './Home';
import 'antd/dist/antd.css';
import Icon from './image/icon.webp';
import React, { useState } from 'react';
import { UserOutlined, LockOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
// import Web3 from 'web3';
import Web3 from 'web3/dist/web3.min.js';

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
      loginVisible: false,
    };
  }

  callback = key => {
    console.log(key);
  }
  
  OperationsSlot = () => {
    return {
      left: iconTitle(),
      right: <Button type="primary" style={{marginRight: 20}} onClick={this.getAccount}>Connect Wallet</Button>,

      //right: <Button type="primary" style={{marginRight: 20}} onClick={this.showLogin}>Login / Signup</Button>,
    };
  };

  offSet = () => {
    return {
      left: <div style={{marginRight:100}}> </div>,
    };
  }

  showLogin = () => {
    this.setState({
      loginVisible: true,
    });
  };

  hideLogin = () => {
    this.setState({
      loginVisible: false,
    });
  };

  loginForm = (login) => {
    return (
      <div className='verticle-central-middle'>
        <Input
          placeholder="Email"
          prefix={<UserOutlined className="site-form-item-icon" />}
          style={{marginTop: 30, marginBottom: 25}}
        />
        <Input.Password 
          placeholder="Password" 
          prefix={<LockOutlined className="site-form-item-icon" />}
          style={{marginBottom: 20}}
        />  
        <Divider />
        {login ? (<Button 
          key="submit" 
          type="primary" 
          size="large" 
          style={{width: "100%", margin: 0}} 
          icon={ <RightOutlined /> } 
          onClick={this.hideLogin}
          >
            Login
        </Button>) : (
        <Button 
          key="submit" 
          type="primary" 
          size="large" 
          style={{width: "100%", margin: 0}} 
          onClick={this.hideLogin}
          icon={ <RightOutlined /> } >
            Signup
        </Button>)}
      </div>
    );
  }
  // getAccount= async() => {
  //   let web3 = new Web3(window.etherum);
  //   console.log(web3);
  //   await window.ethereum.send({method: 'eth_requestAccounts'});
  // }
  async getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    console.log(account);
  }

  render() {
    const {loginVisible} = this.state;
    
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={this.OperationsSlot()} tabBarStyle={{backgroundColor: '#f7f7f7'}}>
          <TabPane tab="Home" key="1">
            <div>
              <Home />
            </div>
          </TabPane>
          <TabPane tab="LeaderBoard" key="2">
              <LeaderBoard />
          </TabPane>
        </Tabs>
        <Modal title={null}
          visible={loginVisible} 
          width={360}
          closable={false}
          footer={null}>
          <CloseOutlined style={{float: 'right'}} onClick={this.hideLogin} />
          <div className='verticle-central-middle'>
            <Avatar size='large' src={Icon} style={{height: 80, width: 80, display: 'flex', marginBottom: 0}} />
            <a className='website-title' style={{display: 'flex', fontSize: 30, marginTop: 0, marginBottom: 10}}>PuppyVote</a>
          </div>
          <div style={{textAlign: 'center'}}>
            <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={this.offSet()}>
              <TabPane tab="Login" key="1">
                {this.loginForm(true)}
              </TabPane>
              <TabPane tab="Signup" key="2">
                {this.loginForm(false)}
              </TabPane>
            </Tabs>
          </div>
        </Modal>  
      </div>
    );
  }
  
};

export default App;