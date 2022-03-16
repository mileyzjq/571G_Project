//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PupyVote{

    struct User{
        address userAddress; 
    } 
    
    struct Dog{
        address ownerAddress; 
        uint numVote;
        string puppyName;
        string gender;
        string dateOfBirth;
        string description;
        // one variable for picture 
    }

    mapping(address => Dog) public adopt;
    mapping(address => uint256) public userVoteBalance;// the number of votes user has confirmed
    
    address owner;
    User[] users;
    
    uint public votePrice;

    constructor() {
        owner = msg.sender;
        votePrice = 100000000000000000; // 0.1 ether
    }

    function createDogProfile(
        uint numVote, string memory _name, string memory _gender, string memory _birthday, string memory _description) public{
        //users.push(User(msg.sender)); 
        //get info from web 
        Dog memory newDog = Dog(msg.sender, numVote, _name, _gender, _birthday, _description);
        adopt[msg.sender] = newDog;
    }
    
    // there should be some input protection in the front end
    function buyVote(uint256 _buyVoteNum) public payable{
        users.push(User(msg.sender));
        require(msg.value >= _buyVoteNum * votePrice);//transfer to sc addr by default
        userVoteBalance[msg.sender] = _buyVoteNum;
    }

    function cancelOrder(uint256 _cancelVoteNum) public payable{
        require(_cancelVoteNum <= userVoteBalance[msg.sender], "requested cancel votes exceeded the total votes available");
        userVoteBalance[msg.sender] -= _cancelVoteNum;
        transferMoney(msg.sender, _cancelVoteNum);
    }

    function transferMoney(address _to, uint256 _cancelVoteNum) public payable returns (bool success) {

        payable(_to).transfer(_cancelVoteNum * votePrice);
        return true;
    }

    function vote(uint256 _voteNum, address dogOwner) public{
        require(_voteNum <= userVoteBalance[msg.sender], "You can't vote more votes than you have!");
        userVoteBalance[msg.sender] -= _voteNum;
        adopt[dogOwner].numVote += _voteNum;
        // need to update
    }

    function endVote() public payable{
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);//transfer money back to owner
    
    }

    function getWinner() public returns (address winner){
        // need to update
        return winner;
    }

    




    
}