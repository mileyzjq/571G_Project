import React, {useState, useEffect} from 'react';
import DogCard from './DogCard';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';
import './App.css';
import 'antd/dist/antd.css';

const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);

const MyDog =(props)=> {
    const {userAccount, isUpdated, isUpdatedVotes} = props;
    const [myDogs, setMyDogs] = useState([]);
    const [account, setAccount] = useState("");
    const [dogInfo, setDogInfo] = useState([]);
    const [votes, setVotes] = useState(0);

    useEffect(() => {
        getDogInfo();
        getVote();
    }, [isUpdated, isUpdatedVotes, userAccount]);

    const displayMyDogs =()=> {
        //console.log(dogInfo[0]);
        return (<div class="dog-card-container">
        {
            myDogs.map(dog => {return (<DogCard class="dog-card-item" dogInfo={[...dog]} updateDogVotes={uploadDogCard} />)})
        }
        </div>);
    }

    const uploadDogCard =()=> {
        getVote();
        getDogInfo();
    }

    const getDogInfo = async() => {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        if(voteContract!=='undefined'){
            try{
                const dogs = await voteContract.methods.getDogs().call();
                console.log("dog array: " + dogs[0]);
                console.log("dog array length: " + dogs.length);
                setDogInfo([...dogs]);
                let list = [];
                dogs.map(dog => {
                    if(dog[0].toUpperCase() === account.toUpperCase()) {
                        console.log(dog[2])
                        list.push(dog);
                    }
                })
                setMyDogs([...list]);
                //getTableData();
            } catch (e) {
                console.log('Error, getDog: ', e)
            }
        }
    }

    const getVote =async()=> {
        if(voteContract!=='undefined'){
            try{
                console.log("get vote");
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                const vote_number = await voteContract.methods.getUserVote(account).call();
                setVotes(vote_number);
            } catch (e) {
                console.log('Error, deposit: ', e)
            }
        }
    }

    return(
        <div>
            <h2 color="#006699" style={{marginLeft: '15%'}}>Vote Number: {votes} vote(s)</h2>
            {displayMyDogs()}
        </div>
    );
}

export default MyDog;