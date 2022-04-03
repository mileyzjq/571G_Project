import './App.css';
import 'antd/dist/antd.css';
import { Divider, Button, Modal, Skeleton, Avatar, Card, Tabs } from 'antd';
import DogCard from './DogCard';
import React from 'react';
import DogForm from './DogForm';
import dogImage1 from './image/dog1.jpeg';
import dogImage2 from './image/dog2.webp';
import { getFilesFromPath } from 'web3.storage';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false,
      voteContract: this.props.voteContract,
    };
  }

  showForm = () => {
    console.log(this.props.userAccount);
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
    const {formVisible, voteContract} = this.state;
    const {userAccount} = this.props;
    
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
          <DogForm userAccount={userAccount} voteContract={voteContract}/>
        </Modal>
        <div class="dog-card-container">
          <DogCard class="dog-card-item" image={dogImage2} /> 
          <DogCard class="dog-card-item" image={dogImage2} /> 
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