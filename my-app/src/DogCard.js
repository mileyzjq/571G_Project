import { Card, Badge, Avatar, Modal, Row, Typography, message } from 'antd';
import { EuroCircleOutlined, LikeOutlined, DislikeOutlined, LikeTwoTone, ManOutlined, WomanOutlined, DislikeTwoTone } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import dogImage2 from './image/dog2.webp';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const { Paragraph, Title } = Typography;

const success = () => {
    message.success('Vote Successfully!');
};

const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);

const DogCard = () => {
    const [profileVisible, setVisible] = useState(false);
    const [likeColor, setLikeColor] = useState(true);
    const [dislikeColor, setDislikeColor] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const changeLikeColor = () => {
        console.log(web3);
        //console.log(netId);
        console.log(voteContract);
        if(dislikeColor) {
            setLikeColor(!likeColor);
        }
    };

    const changeDislikeColor = () => {
        if(likeColor) {
            setDislikeColor(!dislikeColor);
        }
    };

    const Content = ({ children, extraContent }) => (
        <Row>
          <div className="image">{extraContent}</div>
          <div style={{ flex: 1, marginLeft: 30}}>{children}</div>
        </Row>
    );

    const content = (
        <div>
            <Title level={2} style={{color: '#1890ff'}}>Luck</Title>
            <Row>
                <div className="icon-container">
                    <ManOutlined style={{color: 'green', marginRight: 10}} />
                </div>
                <p className="icon-container"><font color="orange">2 years old</font></p>
            </Row>
            <Paragraph>
                My name is Luck. I am a boy. I am a lovely dog. My name is Luck. I am a boy. I am a lovely dog.
                My name is Luck. I am a boy. I am a lovely dog. 
            </Paragraph>
            <Paragraph>
                My name is Luck. I am a boy. I am a lovely dog. I am a lovely dog. 
            </Paragraph>
        </div>
    );

    return (
        <div>
            <Card
                style={{ width: 300, margin: 12 }}
                cover={
                <img
                    alt="dog"
                    src={dogImage2}
                    onClick={()=>setVisible(true)}
                />
                }
                actions={[
                <EuroCircleOutlined key="dog-vote" onClick={success} />,
                <div onClick={changeLikeColor}>
                    {likeColor ? <LikeOutlined /> : <LikeTwoTone key="dog-like" twoToneColor="red" style={{fontSize: 20}}/> }
                </div>,
                <div onClick={changeDislikeColor}>
                    {dislikeColor ? <DislikeOutlined /> : <DislikeTwoTone twoToneColor="grey" style={{fontSize: 20}}/> }
                </div>
                ]}
            >
            </Card>
            <Modal
                title="Dog Profile"
                visible={profileVisible}
                onOk={()=>setVisible(false)}
                onCancel={()=>setVisible(false)}
                okText="Vote for Pet"
            >
                <Content
                    extraContent={
                        <Avatar
                            size='large' 
                            src={dogImage2} 
                            style={{height: 80, width: 80, display: 'flex', marginBottom: 0}}
                        />
                    }
                >
                    {content}
                </Content>
            </Modal>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>   
    );
}

export default DogCard;