import './App.css';
import 'antd/dist/antd.css';
import { Divider, Button, Modal, Skeleton, Avatar, Card, Tabs } from 'antd';
import DogCard from './DogCard';
import React from 'react';
import DogForm from './DogForm';
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
      dogInfo: [],
    };
  }

  componentDidMount() {
    this.getDogInfo();
  }

  getDogInfo = async() => {
    console.log(this.state.voteContract);
    if(voteContract1!=='undefined'){
      try{
        const dogs = await voteContract1.methods.getDogs().call();
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

  render() {
    const {formVisible} = this.state;
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
        >
          <DogForm userAccount={userAccount} uploadDogCard={this.uploadDogCard}/>
        </Modal>
        {this.getDogLines()}
      </div>
    );
  }
}

export default Home;