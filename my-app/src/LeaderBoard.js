import { Table, Tag, Space, Button, Avatar, message, Modal, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import './App.css';
import dogImage from './image/dog1.jpeg';
import dogImage2 from './image/dog2.webp';
import crown from './image/crown.webp';
import DogCard from './DogCard';

const success = () => {
    message.success('Vote Successfully!');
};

const countDown = () => {
  const modal = Modal.success({
    title: 'End Vote successfully',
    width: "36%",
    content: (<Result
      icon={<div><img src={crown} alt="crown" style={{marginTop: -50, width: 200, height: 200}}/> <Avatar src={dogImage2} style={{width: 160, height: 160, marginTop: -78}} /></div>}
      title="Congratulations! John won $20!"
    />),
    footer: null
  });
  setTimeout(() => {
    modal.destroy();
  }, 6000);
}

const columns = [
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
    render: text => <a>{text}</a>,
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
        <Button type="primary" onClick={success}>Vote {record.name}</Button>
      </Space>
    ),
  },
];

const LeaderBoard = (props) => {
  const {userAccount, voteContract} = props;
  const [dogsInfo, setDogsInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isInitialized, setIsInitialize] = useState(false);

  useEffect(() => {
    if(!isInitialized) {
      getDogInfo();
    }
    setIsInitialize(true);
  }, [isInitialized]);

  const getDogInfo = async() => {
    console.log(voteContract);
    if(voteContract!=='undefined'){
      try{
        const dogs = await voteContract.methods.getDogs().call({from: userAccount});
        console.log("dog array: " + dogs[0]);
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
        name: dogsInfo[i][2],
        dob: dogsInfo[i][4],
        gender: dogsInfo[i][3],
        votes: dogsInfo[i][1],
        tags: dogsInfo[i][5],
        avatar: dogsInfo[i][7]
      });
    }
    setTableData([...list]);
  }

  const getDogCardsLine = (list)=> {
    console.log(1);
    for(let i=0; i<list.length; i++) {
      <DogCard />
    }
  }

  return (
    <div style={{width: "90%", marginLeft: "4%", color: "#f7f7f7", marginTop: "40"}}>
      <Button type="primary" onClick={countDown} style={{marginBottom: 15}}> End Vote </Button>
      <Button type="primary" onClick={getDogInfo} style={{marginBottom: 15, marginLeft: 15}}> Refresh Table </Button>
      <Table
        columns={columns}
        dataSource={tableData}
      />
      {getDogCardsLine([1,3])}
    </div>
  );
}

export default LeaderBoard;