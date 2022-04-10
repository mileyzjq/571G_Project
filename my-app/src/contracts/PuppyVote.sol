//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PuppyVote{

    struct User{
        address userAddress; 
    } 
    
    struct Dog{
        address ownerAddress; 
        uint numVote;
        string puppyName;
        string gender;
        string dateOfBirth;
        string[] tags;
        string description;
        string dogPicture;
    }

    mapping(address => Dog) public adopt;   // a user has a dog
    mapping(address => uint256) public userVoteBalance;// the number of votes user has confirmed
    
    address owner;
    User[] public users;
    Dog[] dogs;
    
    uint public votePrice;

    constructor() {
        owner = msg.sender;
        votePrice = 100000000000000000; // 0.1 ether
    }

    modifier notEmpty (string memory _input) {
        require(bytes(_input).length!= 0, "Dog name can not be empty!");
        _;
    }

    function createDogProfile(string memory _name, string memory _gender, string memory _birthday, string[] memory _tags, string memory _description, string memory _dogPicture) public payable notEmpty (_name){
        //users.push(User(msg.sender)); 
        //get info from web 
        require(msg.value >= votePrice, "Not enough money to create a dog profile"); //transfer to sc addr by default
        Dog memory newDog = Dog(msg.sender, 0, _name, _gender, _birthday, _tags, _description, _dogPicture);
        adopt[msg.sender] = newDog;
        dogs.push(newDog);
    }
    
    // there should be some input protection in the front end
    function buyVote(uint256 _buyVoteNum) public payable{
        users.push(User(msg.sender));
        require(msg.value >= _buyVoteNum * votePrice, "Not enough money to buy a vote"); //transfer to sc addr by default
        userVoteBalance[msg.sender] += _buyVoteNum;
        //payable(owner).transfer(_buyVoteNum * votePrice);
        // addressshg(this): the address of the smart contract
        //transferMoney(address(this), _buyVoteNum);
        //bool flag = payable(address(this)).send(100000000000000000);
        //require(flag == true, "failure of sending the money");
        
        //payable(address(this)).transfer(votePrice);
    }

    function cancelOrder(uint256 _cancelVoteNum) public payable{
        require(_cancelVoteNum <= userVoteBalance[msg.sender], "requested cancel votes exceeded the total votes available");
        userVoteBalance[msg.sender] -= _cancelVoteNum;
        payable(msg.sender).transfer(votePrice * _cancelVoteNum);
    }

    // to: get the money, source of pain
    // function transferMoney(address _to, uint256 _voteNum) public payable returns (bool success) {
    //     require(msg.value >= _voteNum * votePrice, "Not enough ether");
    //     payable(_to).transfer(_voteNum * votePrice);
    //     return true;
    // }

    function vote(uint256 _voteNum, string memory _dogName, address dogOwner) public{
        require(_voteNum <= userVoteBalance[msg.sender], "You can't vote more votes than you have!");
        userVoteBalance[msg.sender] -= _voteNum;
        adopt[dogOwner].numVote += _voteNum;//update dog's vote
        uint256 l = dogs.length;
        for (uint i = 0; i < l; i++) {
            if(dogs[i].ownerAddress == dogOwner && keccak256(bytes(dogs[i].puppyName)) == keccak256(bytes(_dogName))) {
                dogs[i].numVote += _voteNum;
            }
        }
        rank();//update leader board
    }

    // calculate the winner, and return money to the winner
    function endVote() public payable{
        require(msg.sender == owner, "only the admin can end vote");
        Dog[] memory result = rank();
        // the winning dog
        Dog memory winningDog = result[0];
        address winner = winningDog.ownerAddress;
        payable(winner).transfer((address(this).balance)/5*4);
        //payable(owner).transfer(address(this).balance);//transfer money back to owner
        reset();
    }

    function deleteDogProfile(string memory _dogName) public {
            uint256 l = dogs.length;
            for (uint i = 0; i < l; i++){
                if(dogs[i].ownerAddress == msg.sender && keccak256(bytes(dogs[i].puppyName)) == keccak256(bytes(_dogName))){
                    dogs[i] = dogs[l - 1];
                }
            }
            dogs.pop();
    }

    function rank() public returns (Dog[] memory){
        uint256 l = dogs.length;
        for (uint i = 0; i < l; i++) {
            for (uint j = i + 1; j < l; j++) {
                if(dogs[i].numVote < dogs[j].numVote){
                    Dog memory tmp = dogs[j];
                    dogs[j] = dogs[i];
                    dogs[i] = tmp;
                }
            }
        }
        return dogs;
    }

    function reset() public {
        uint256 l = dogs.length;
        for (uint i = 0; i < l; i++) {
            dogs[i].numVote=0;//reset to zero
        }
        uint256 len = users.length;

        for (uint i = 0; i < len; i++) {
            adopt[users[i].userAddress].numVote=0;//reset to zero
        }
    }
    
    function getDogs() public view returns (Dog[] memory) {
        return dogs;
    }

    function getDogByIndex(uint index) public view returns(string memory, string memory, string memory, string[] memory, string memory, string memory) {
        return (dogs[index].puppyName, dogs[index].gender, dogs[index].dateOfBirth, dogs[index].tags, dogs[index].description, dogs[index].dogPicture);
    }

    function getLastDogName() public view returns (string memory) {
        Dog memory dog = dogs[dogs.length-1];
        return dog.puppyName;
    }

    function getLastDogVote() public view returns (uint256) {
        Dog memory dog = dogs[dogs.length-1];
        return dog.numVote;
    }

    function getUserVote(address addr) public view returns (uint256 ) {
        return userVoteBalance[addr];
    }

    function getAdoptDogVote(address addr) public view returns (uint256 ) {
        return adopt[addr].numVote;
    }

       //get balance
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getAdmin() public view returns (address admin) {
        return owner;
    }
}