import { Card, Badge, Avatar, Modal, Skeleton } from 'antd';
import { EuroCircleOutlined, LikeOutlined, DislikeOutlined, LikeTwoTone, DislikeTwoTone } from '@ant-design/icons';
import dogImage from './image/dog1.jpg';
import React, { useState } from 'react';


const DogCard = () => {
    const [profileVisible, setVisible] = useState(false);
    const [likeColor, setLikeColor] = useState(true);
    const [dislikeColor, setDislikeColor] = useState(true);

    const hideModal = () => {
        setVisible(false);
    };
    
    const changeLikeColor = () => {
        if(dislikeColor) {
            setLikeColor(!likeColor);
        }
    };

    const changeDislikeColor = () => {
        if(likeColor) {
            setDislikeColor(!dislikeColor);
        }
    };

    return (
        <div>
            <Card
                style={{ width: 300, margin: 12 }}
                cover={
                <img
                    alt="dog"
                    src={dogImage}
                    onClick={()=>setVisible(true)}
                />
                }
                actions={[
                <EuroCircleOutlined key="dog-vote" />,
                <div onClick={changeLikeColor}>
                    {likeColor ? <LikeOutlined /> : <LikeTwoTone key="dog-like" twoToneColor="red" style={{fontSize: 20}}/> }
                </div>,
                <div onClick={changeDislikeColor}>
                    {dislikeColor ? <DislikeOutlined /> : <DislikeTwoTone key="dog-dislike" twoToneColor="blue" style={{fontSize: 20}}/> }
                </div>,
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
                <Skeleton avatar paragraph={{ rows: 4 }} >
                    <Card
                    avatar={<Avatar src={dogImage} size={64} />}
                    title="Card title"
                    description="This is the description"
                    />
                </Skeleton>
            </Modal>
        </div>   
    );
}

export default DogCard;
