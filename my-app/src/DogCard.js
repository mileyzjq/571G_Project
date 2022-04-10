import { Card, Badge, Avatar, Modal, Row, Typography, message, InputNumber } from 'antd';
import { EuroCircleOutlined, LikeOutlined, DislikeOutlined, LikeTwoTone, ManOutlined, WomanOutlined, DislikeTwoTone } from '@ant-design/icons';
import React, { useState, useEffect} from 'react';
import Web3 from 'web3/dist/web3.min.js';
import PuppyVote from './abis/PuppyVote.json';

const { Paragraph, Title } = Typography;

const success = () => {
    message.success('Vote Successfully!');
};

const  voteError = () => {
    message.error('Not enough vote or ether!');
  };

const web3 = new Web3(window.ethereum);
const netId = 5777;
const voteContract = new web3.eth.Contract(PuppyVote.abi, PuppyVote.networks[netId].address);


const DogCard = (props) => {
    const {updateDogVotes, dogInfo} = props;
    const [profileVisible, setVisible] = useState(false);
    const [votes, setVotes] = useState(0);
    const [likeColor, setLikeColor] = useState(true);
    const [dislikeColor, setDislikeColor] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async() => {
        if(voteContract!=='undefined'){
            try{
              await votePuppy(votes, dogInfo[0], dogInfo[2]);
              updateDogVotes();
            } catch (e) {
              console.log('Error, deposit: ', e)
            }
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const changeLikeColor = () => {
        //console.log(netId);
        console.log(dogInfo);
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


    const inputNumberChange = (value) => {
        console.log("onchange: " + value);
        setVotes(value);
        
      }

    const votePuppy = async(votes, dogOwner, dogName) => {
        // const {userAccount, voteContract} = this.props;
        console.log("voteContract: "+voteContract);
        // console.log("dogOwner: " + dogOwner);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log("account: "+account);
        let voteNumber = await voteContract.methods.getUserVote(account).call();
        console.log("voteNumber: ", voteNumber);
        if(votes > voteNumber) {
          console.log("User's vote number is not enough", voteNumber);
          voteError();
          return;
        }
        if(voteContract!=='undefined'){
          console.log("owner: ", dogOwner);
          try{
            await voteContract.methods.vote(votes, dogName, dogOwner).send({from: account});
            success();
          } catch (e) {
            console.log('Error, getDog: ', e)
          }
        }
      }

    const content = (
        <div>
            <Title level={2} style={{color: '#1890ff'}}>{dogInfo[2]}</Title>
            <Row>
                <div className="icon-container">
                {dogInfo[3] === "male" ? <ManOutlined style={{color: 'green', marginRight: 10}} /> : <WomanOutlined style={{color: 'red', marginRight: 10}}/> }

                </div>
                
                <p className="icon-container"><font color="orange">{dogInfo[4]}</font></p>
                <p className="icon-container"><font color="orange">{dogInfo[1]} vote(s)</font></p>
            </Row>
            <Paragraph>
                   {dogInfo[6]} 
            </Paragraph>
            <Paragraph>
                I am a lovely dog. Please vote for me. 
            </Paragraph>
        </div>
    );
    return (
        
        <div>
            <Card
                style={{ width: 320, margin: 12 }}
                cover={
                <img
                    alt="dog"
                    src={dogInfo[7]}
                    onClick={()=>setVisible(true)}
                />
                }
                actions={[
                
                <EuroCircleOutlined key="dog-vote" onClick={()=>showModal()} />,
                // <EuroCircleOutlined key="dog-vote" onClick={()=>votePuppy()} />,
                
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
            >
                <Content
                    extraContent={
                        <Avatar
                            size='large' 
                            src={dogInfo[7]} 
                            style={{height: 80, width: 80, display: 'flex', marginBottom: 0}}
                        />
                    }
                >
                    {content}
                </Content>
            </Modal>
            <Modal title="Vote Puppy" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>How many votes do you want to vote? </p>
                <InputNumber min={1} max={10} onChange={inputNumberChange} />
            </Modal>
        </div>   
    );
}

export default DogCard;