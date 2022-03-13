import './App.css';
import 'antd/dist/antd.css';
import { Divider, Button, Modal, Skeleton, Avatar, Card, Tabs } from 'antd';
import DogCard from './DogCard';
import React from 'react';
import DogForm from './DogForm';
import dogImage from './image/dog1.jpg';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false
    };
  }

  showForm = () => {
    this.setState({
      formVisible: true,
    });
  };

  hideForm = () => {
    this.setState({
      formVisible: false,
    });
  };

  callback = key => {
    console.log(key);
  }
  

  render() {
    const {formVisible} = this.state;

    return (
      <div className="App-setting">
        <div className='title-container'>
          <h1 style={{fontWeight: 'bold', textAlign: 'center'}}>Vote for your Favourite puppies! </h1>
          <Button type="primary" style={{display: 'flex'}} onClick={() => this.showForm()}>Upload Puppies</Button>
        </div>
        <Modal
          title={<a>Create Dog Profile</a>}
          visible={formVisible}
          onOk={this.hideForm}
          onCancel={this.hideForm}
          okText="Submit"
        >
          <DogForm />
        </Modal>
        <div class="dog-card-container">
          <DogCard class="dog-card-item" /> 
          <DogCard class="dog-card-item" /> 
          <DogCard class="dog-card-item" /> 
        </div>
        <div class="dog-card-container">
          <DogCard class="dog-card-item" />
          <DogCard class="dog-card-item"/>
          <DogCard class="dog-card-item"/>
        </div>
      </div>
    );
  }
}

export default Home;