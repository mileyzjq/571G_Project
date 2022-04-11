import './App.css';
import 'antd/dist/antd.css';
import { Divider, Button, Modal, Form, Input, Carousel, message } from 'antd';
import DogCard from './DogCard';
import React, {useState, useEffect} from 'react';
import DogForm from './DogForm';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract1 = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);

const deleteError = () => {
  message.error('You can only delete the dog created by you!');
};

const deleteSuccess = () => {
  message.success('Delete a puppy Successfully!');
};

const Home =(props)=> {
  const {updateDogCard, updateVotes} = props;
  const [formVisible, setFormVisible] = useState(false);
  const [dogInfo, setDogsInfo] = useState([]);
  const [isInitialized, setIsInitialize] = useState(false);
  const [puppyName, setPuppyName] = useState("");
  const [formVisibleDelete, setFormVisibleDelete] = useState(false);

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
        dogInfo.map(dog => {return (<DogCard class="dog-card-item" dogInfo={[...dog]} updateDogVotes={updateDogVotes} />)})
      }
    </div>);
  }

  const uploadDogCard =()=> {
    getDogInfo();
    updateDogCard();
  }

  const updateDogVotes =()=> {
    getDogInfo();
    updateVotes();
  }

  const showFormDelete = () => {
    setFormVisibleDelete(true);
  };

  const hideFormDelete = () => {
    setFormVisibleDelete(false);
  };


  const deleteByPuppyName = (e) => {
    setPuppyName(e.target.value);
  }

  const findDog =(account)=> {
    let flag = false;
    dogInfo.map(dog => {
      if(dog[0].toUpperCase() === account.toUpperCase() && dog[2] === puppyName) {
        flag = true;
      }
    })
    return flag;
  }

  const onOkWithDelete = async() => {
    const accounts = await web3.eth.getAccounts();
    const userAccount1 = accounts[0];
    console.log("account: ", userAccount1);
    console.log("dog array length before delete: " + dogInfo.length);
    const flag = findDog(userAccount1);
    console.log(flag);
    if(!flag) {
      deleteError();
      return;
    }
    if(voteContract1!=='undefined'){
      try{
        console.log("puppyName: "+ puppyName);
        console.log("dog array length before delete: " + dogInfo.length);
        console.log("voteContract1"+voteContract1);
        await voteContract1.methods.deleteDogProfile(puppyName).send({from: userAccount1});
        getDogInfo();
        deleteSuccess();
        updateDogCard();
        console.log("dog array length after delete: " + dogInfo.length);
      } catch (e) {
        console.log('Error, cannot delete: ', e)
      }
    }
    setFormVisibleDelete(false);
  }
    
  return (
    <div className="App-setting">
      <div className='title-container'>
        <h1 style={{fontWeight: 'bold', textAlign: 'center'}}>Vote for your Favourite puppies! </h1>
        <span style={{marginBottom: 15}}>
          <Button type="primary" style={{marginRight: 30}} onClick={() => showForm()}>Upload A Puppy</Button>
          <Button type="primary" onClick={() => showFormDelete()}>Delete A Puppy</Button>
        </span>
      </div>
      <Modal
        title={<a>Create Dog Profile</a>}
        visible={formVisible}
        onOk={hideForm}
        onCancel={hideForm}
      >
        <DogForm uploadDogCard={uploadDogCard}/>
      </Modal>
      <Modal
          title={<a>Delete Dog Profile</a>}
          visible={formVisibleDelete}
          onOk={onOkWithDelete}
          onCancel={hideFormDelete}
        >
          <p>You can only delete the puppy created by you </p>
          <p>Please enter the puppy name </p>
          <Input onChange={deleteByPuppyName} style={{width: 200}}/>
        </Modal>
      {getDogLines()}
    </div>
  );
}

export default Home;