import './App.css';
import 'antd/dist/antd.css';
import { Divider, Button, Modal, Skeleton, Avatar, Card, Tabs } from 'antd';
import DogCard from './DogCard';
import React from 'react';
import DogForm from './DogForm';
import dogImage1 from './image/dog1.jpeg';
import dogImage2 from './image/dog2.webp';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false,
      voteContract: this.props.voteContract,
      userAccount: this.props.userAccount,
      dogInfo: [],
    };
  }

  componentDidMount() {
    this.getDogInfo();
    //this.createDogElement();
  }

  getDogInfo = async() => {
    console.log(this.state.voteContract);
    const {voteContract, userAccount} = this.props;
    if(voteContract!=='undefined'){
      try{
        const dogs = await voteContract.methods.getDogs().call({from: userAccount});
        console.log("dog array: " + dogs[0]);
        console.log("dog array length: " + dogs.length);
        this.setState({
          dogInfo: [...dogs],
        });
        //setDogsInfo([...dogs]);
        //getTableData();
      } catch (e) {
        console.log('Error, getDog: ', e)
      }
    }
  }

  showForm = () => {
    console.log(this.props.userAccount);
    this.setState({
      formVisible: true,
    });
  };

  hideForm = () => {
    this.setState({
      formVisible: false,
    });
  };

  callback = key => {
    console.log(key);
  }

  getAllDogCards = ()=> {
    const {dogInfo, voteContract} = this.state;
    const len = dogInfo.length;
    switch (len) {
      case 1:
        return (<div class="dog-card-container"><DogCard class="dog-card-item" dogInfo={dogInfo[0]} voteContract={voteContract}/></div>); 
      case 2:
        return (<div class="dog-card-container">
            <DogCard class="dog-card-item" dogInfo={dogInfo[0]} /> 
            <DogCard class="dog-card-item" dogInfo={dogInfo[1]} />
          </div>);
      case 3:
        return (<div class="dog-card-container">
            <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
            <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
            <DogCard class="dog-card-item" /> 
          </div>);
      case 4:
        return (<div class="dog-card-container">
            <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
            <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
            <DogCard class="dog-card-item" /> 
            <DogCard class="dog-card-item" /> 
          </div>);
      case 5:    
        return (<div class="dog-card-container">
          <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
          <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
          <DogCard class="dog-card-item" /> 
          <DogCard class="dog-card-item" /> 
          <DogCard class="dog-card-item" /></div>);
      case 6:    
        return (<div class="dog-card-container">
            <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
            <DogCard class="dog-card-item" dogInfo={dogImage2} /> 
            <DogCard class="dog-card-item" /> 
            <DogCard class="dog-card-item" /> 
            <DogCard class="dog-card-item" /> 
            <DogCard class="dog-card-item" /></div>);
      default:
        break;
     }
  }

  // createDogElement =()=> {
  //   for (var n = 0; n < 2; n++) {  
  //          //获取div  
  //           var div = document.getElementById("DvelopmentTarget");  
  
  //           //换行  
  //           var br = document.createElement("br");  
  //           div.appendChild(br);  
  
  //           //添加label ，存放指标名称  
  //           var div2 = document.createElement("label");  
  //           div2.innerText = "helllo";  
  //           div.appendChild(div2);  
  
  //           //添加text ，存放指标权重  
  //           var input = document.createElement("input");  
  //           input.setAttribute('type', 'text');     
  //           input.setAttribute('ReadOnly', 'True');  //设置文本为只读类型  
  //           input.value = 100 
  //           div.appendChild(input);  
              
  //           //添加select 存放指标id  
  //           var targetID = document.createElement("select");  
  //           targetID.innerText = 356;  
  //           targetID.setAttribute('hidden', 'hidden');  
  //           div.appendChild(targetID);  
  //           var br = document.createElement("br");  
  //           div.appendChild(br);   
  //       }  
  // }  
  

  render() {
    const {formVisible} = this.state;
    const {userAccount, voteContract} = this.props;
    
    return (
      <div className="App-setting">
        <div className='title-container'>
          <h1 style={{fontWeight: 'bold', textAlign: 'center'}}>Vote for your Favourite puppies! </h1>
          <Button type="primary" style={{display: 'flex'}} onClick={() => this.showForm()}>Upload Puppies</Button>
        </div>
        <Modal
          title={<a>Create Dog Profile</a>}
          visible={formVisible}
          onOk={this.hideForm}
          onCancel={this.hideForm}
          okText="Submit"
        >
          <DogForm userAccount={userAccount} voteContract={voteContract}/>
        </Modal>
        {this.getAllDogCards()}
      </div>
    );
  }
}

export default Home;