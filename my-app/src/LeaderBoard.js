import { Table, Tag, Space, Button, Avatar, message } from 'antd';
import React from 'react';
import './App.css';
import dogImage from './image/dog1.jpg';

const success = () => {
    message.success('Vote Successfully!');
};

const columns = [
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar',
    className: "table-replaceColor",
    render: avatar => <Avatar src={dogImage} />,
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
          if (tag === 'loser') {
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
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe',
    age: 1,
    gender: 'male',
    votes: 111,
    tags: ['cool', 'smart'],
  },
];

class LeaderBoard extends React.Component {
  state = {
    top: 'topLeft',
    bottom: 'bottomRight',
  };

  render() {
    return (
      <div style={{width: "90%", marginLeft: "4%", color: "#f7f7f7", marginTop: "40"}}>
        <Table
          columns={columns}
          pagination={{ position: [this.state.bottom] }}
          dataSource={data}
        />
      </div>
    );
  }
}

export default LeaderBoard;