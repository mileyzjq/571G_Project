import { Table, Tag, Space, Button, Avatar, message, Modal, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import './App.css';
import dogImage from './image/dog1.jpeg';
import dogImage2 from './image/dog2.webp';
import crown from './image/crown.webp';
import DogCard from './DogCard';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);

const success = () => {
    message.success('Vote Successfully!');
};

const voteError = () => {
  message.error('Not enough vote or ether!');
};

const endVoteError = () => {
  message.error('No permission! Only admin can end vote!');
};

const LeaderBoard = (props) => {
  const {userAccount} = props;
  const [dogsInfo, setDogsInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isInitialized, setIsInitialize] = useState(false);
  const [voteNumber, setVoteNumber] = useState(0);
  const [admin, setAdmin] = useState("");

  useEffect(() => {
    if(!isInitialized) {
      getDogInfo();
      getVote();
    }
    setIsInitialize(true);
  }, [isInitialized]);

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      className: "table-replaceColor",
      render: id => <p>{id}</p>,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      className: "table-replaceColor",
      render: avatar => <Avatar src={avatar} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: "table-replaceColor",
      render: text => (<a>{text}</a>),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      className: "table-replaceColor",
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      className: "table-replaceColor",
    },
    {
      title: 'Vote Counts',
      dataIndex: 'votes',
      key: 'votes',
      className: "table-replaceColor",
      render: text => <p style={{color: 'orange'}}>{text}</p>,
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      className: "table-replaceColor",
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'lazy' || tag === 'pretty') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      className: "table-replaceColor",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={()=>votePuppy(record.owner, record.name)}>Vote {record.name}</Button>
        </Space>
      ),
    },
  ];

  const countDown = async() => {
    if(await endVote() === false) {
      return;
    }
    const modal = Modal.success({
      title: 'End Vote successfully',
      width: 460,
      content: (<Result
        icon={<div><img src={crown} alt="crown" style={{marginTop: -50, width: 200, height: 200}}/>
        <Avatar src={tableData[0].avatar} style={{width: 160, height: 160, marginTop: -78}} /></div>}
        title= {"Congratulations! " + tableData[0].name + " wins the competition!"}
      />),
      footer: null
    });
    setTimeout(() => {
      modal.destroy();
    }, 6000);
  }

  const votePuppy = async(dogOwner, dogName) => {
    let voteNumber = await voteContract.methods.getUserVote(userAccount).call();
    console.log("hello: ", voteNumber);
    if(voteNumber < 1) {
      console.log("hello: ", voteNumber);
      voteError();
      return;
    }
    if(voteContract!=='undefined'){
      console.log("owner: ", dogOwner);
      try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        await voteContract.methods.vote(1, dogName, dogOwner).send({from: account});
        success();
        getDogInfo();
      } catch (e) {
        console.log('Error, getDog: ', e)
      }
    }
  }

  const getVote = async()=> {
    if(voteContract!=='undefined' && voteContract !== 'null'){
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      try{
        let vote_number = await voteContract.methods.getUserVote(account).call();
        console.log("dog vote: " + vote_number);
        setVoteNumber(vote_number);
      } catch (e) {
        console.log('Error, vote number: ', e)
      }
    }
  }

  const endVote = async()=> {
    if(voteContract!=='undefined'){
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      let admin = await voteContract.methods.getAdmin().call();
      console.log(account);
      console.log(admin);
      if (account.toUpperCase() !== admin.toUpperCase()) {
        console.log('flase');
        endVoteError();
        return false;
      }
      console.log('flase true');
      try{
        await voteContract.methods.endVote().send({from: admin});
        getDogInfo();
      } catch (e) {
        console.log('Error, end vote: ', e)
      }
      return true;
    }
  }

  const getDogInfo = async() => {
    console.log(voteContract);
    if(voteContract!=='undefined'){
      try{
        const dogs = await voteContract.methods.getDogs().call({from: userAccount});
        console.log("dog array: " + dogs[0]);
        console.log("dog array: " + dogs[1]);
        console.log("dog array length: " + dogs.length);
        setDogsInfo([...dogs]);
        getTableData(dogs);
      } catch (e) {
        console.log('Error, getDog: ', e)
      }
    }
  }

  const getTableData = (dogsInfo) => {
    const len = dogsInfo.length;
    console.log("table" + len);
    let list = [];
    for(let i=0; i<len; i++) {
      list.push({
        key: i+1,
        rank: i+1,
        name: dogsInfo[i][2],
        dob: dogsInfo[i][4],
        gender: dogsInfo[i][3],
        votes: dogsInfo[i][1],
        tags: dogsInfo[i][5],
        avatar: dogsInfo[i][7],
        owner: dogsInfo[i][0]
      });
    }
    setTableData([...list]);
  }

  return (
    <div style={{width: "90%", marginLeft: "4%", color: "#f7f7f7", marginTop: "40"}}>
      <Button type="primary" onClick={countDown} style={{marginBottom: 15}}> End Vote </Button>
      <Button type="primary" onClick={getDogInfo} style={{marginBottom: 15, marginLeft: 15}}> Refresh Table </Button>
      <Table
        columns={columns}
        dataSource={tableData}
      />
    </div>
  );
}

export default LeaderBoard;