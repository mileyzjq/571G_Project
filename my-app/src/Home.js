import './App.css';
import 'antd/dist/antd.css';
import { Divider, Button, Modal, Skeleton, Avatar, Card, Tabs } from 'antd';
import DogCard from './DogCard';
import React, {useState, useEffect} from 'react';
import DogForm from './DogForm';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract1 = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);

const Home =()=> {
  const [formVisible, setFormVisible] = useState(false);
  const [dogInfo, setDogsInfo] = useState([]);
  const [isInitialized, setIsInitialize] = useState(false);

  useEffect(() => {
    if(!isInitialized) {
      getDogInfo();
    }
    setIsInitialize(true);
  }, [isInitialized]);

  const getDogInfo = async() => {
    if(voteContract1!=='undefined'){
      try{
        const dogs = await voteContract1.methods.getDogs().call();
        console.log("dog array: " + dogs[0]);
        console.log("dog array length: " + dogs.length);
        setDogsInfo([...dogs]);
        //getTableData();
      } catch (e) {
        console.log('Error, getDog: ', e)
      }
    }
  }

  const showForm = () => {
    setFormVisible(true);
  };

  const hideForm = () => {
    setFormVisible(false);
  };

  const callback = key => {
    console.log(key);
  }

  const getDogLines =()=> {
    console.log(dogInfo[0]);
    return (<div class="dog-card-container">
      {
        dogInfo.map(dog => {return (<DogCard class="dog-card-item" dogInfo={[...dog]} />)})
      }
    </div>);
  }

  const uploadDogCard =()=> {
    getDogInfo();
  }
    
  return (
    <div className="App-setting">
      <div className='title-container'>
        <h1 style={{fontWeight: 'bold', textAlign: 'center'}}>Vote for your Favourite puppies! </h1>
        <Button type="primary" style={{display: 'flex'}} onClick={() => showForm()}>Upload Puppies</Button>
      </div>
      <Modal
        title={<a>Create Dog Profile</a>}
        visible={formVisible}
        onOk={hideForm}
        onCancel={hideForm}
      >
        <DogForm uploadDogCard={uploadDogCard}/>
      </Modal>
      {getDogLines()}
    </div>
  );
}

export default Home;