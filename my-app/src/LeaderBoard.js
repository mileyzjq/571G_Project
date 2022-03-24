import { Table, Tag, Space, Button, Avatar, message, Modal, Result } from 'antd';
import React, { useState } from 'react';
import './App.css';
import dogImage from './image/dog1.jpg';
import dogImage2 from './image/dog2.webp';
import crown from './image/crown.webp';

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
    render: avatar => <Avatar src={dogImage2} />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    className: "table-replaceColor",
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
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

const data = [
  {
    key: '1',
    name: 'John',
    age: 2,
    gender: 'male',
    votes: 333,
    tags: ['nice', 'lovely'],
  },
  {
    key: '2',
    name: 'Jim',
    age: 3,
    gender: 'female',
    votes: 222,
    tags: ['lazy'],
  },
  {
    key: '3',
    name: 'Joe',
    age: 1,
    gender: 'male',
    votes: 111,
    tags: ['cool', 'smart'],
  },
  {
    key: '4',
    name: 'Sally',
    age: 1,
    gender: 'female',
    votes: 101,
    tags: ['nice', 'pretty'],
  },
  {
    key: '5',
    name: 'Nancy',
    age: 4,
    gender: 'female',
    votes: 50,
    tags: ['naughty'],
  },
];

const LeaderBoard = () => {

  return (
    <div style={{width: "90%", marginLeft: "4%", color: "#f7f7f7", marginTop: "40"}}>
      <Button type="primary" onClick={countDown} style={{marginBottom: 15}}> End Vote </Button>
      <Table
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}

export default LeaderBoard;