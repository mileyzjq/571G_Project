import { Tabs, Button, Avatar, Modal, Input, Divider } from 'antd';
import React, { useState, useRef, Component } from 'react';
import Icon from './image/icon.webp';
import { UserOutlined, LockOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';

class Login extends Component {
    state = {
      visible: this.props.loginVisible,
    };
    
    hideModal = () => {
      this.setState({
        visible: false,
      });
      console.log("hide: " + this.state.visible);
    };  

    static getDerivedStateFromProps(props, state) {
      //console.log("props: " + this.state.visible);
      if (props.loginVisible !== state.visible) {
        console.log("props: " + state.visible);
        return {
          visible: props.loginVisible,
        };
      }
      return null;
    }
  

    render () {
      const {visible} = this.state;
      console.log("visible" + visible);
      return (
        <Modal title={null}
            visible={visible} 
            width={360}
            closable={false}
            footer={null}>
            <CloseOutlined style={{float: 'right'}} onClick={this.hideModal} />
            <div className='verticle-central-middle'>
              <Avatar size='large' src={Icon} style={{height: 80, width: 80, display: 'flex', marginBottom: 0}} />
              <a className='website-title' style={{display: 'flex', fontSize: 30, marginTop: 0}}>PuppyVote</a>
              <Input
                placeholder="Email"
                prefix={<UserOutlined className="site-form-item-icon" />}
                style={{marginTop: 20, marginBottom: 25}}
              />
              <Input.Password 
                placeholder="Password" 
                prefix={<LockOutlined className="site-form-item-icon" />}
                style={{marginBottom: 20}}
              />  
              <Divider />
            </div>
            <Button 
                key="submit" 
                type="primary" 
                size="large" 
                style={{width: "100%", margin: 0}} 
                icon={ <RightOutlined /> } 
                onClick={this.hideModal}>
                  Login
              </Button>
          </Modal>
      );
    }
  };
  
  export default Login;