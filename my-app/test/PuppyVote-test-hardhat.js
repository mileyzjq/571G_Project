// const { expect } = require("chai");
// //const { ethers } = require("hardhat");

// describe("Puppy Vote contract", function () {
//     let VotingShop;
//     let voting;
//     let owner;
//     let addr1;
//     let addr2;
    
//     beforeEach(async function () {
//         VotingShop = await ethers.getContractFactory("PuppyVote");
//         [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
//         voting = await VotingShop.connect(owner).deploy();//admin = owner;
//     });

//     it("Should not create a dog profile if do not have dog name", async function () {
//         await expect(voting.createDogProfile("", "female", "2020-01-02", ["cute", "lovely"], "I am a dog")).to.be.revertedWith("Dog name can not be empty!");
//     });

//     it("Should create a dog profile if everything is OK", async function () {
//         await expect(voting.createDogProfile("Nancy", "female", "2020-01-02", ["nice"], "I am a dog"));
//         expect(await voting.getLastDogName() === "Nancy");
//     });

//     it("Should cannot buy vote if do not send enough money", async function () {
//         await expect(voting.buyVote(2,{value: "100000000000000000"})).to.be.revertedWith("Not enough money");
//     });

//     // bug fixed
//     it("Should buy vote if everything is OK", async function () {
//         await expect(voting.connect(addr1).buyVote(2,{value: "200000000000000000"}));//0.2ether
//         expect(await voting.userVoteBalance(addr1.address)).to.equal(2);
//         // console.log(addr1.getAddress());
//         //console.log(await voting.connect(addr1).buyVote(2, {value: "200000000000000000"}));
//     });  
    
//     it("Could not cancel order if not enough vote", async function () {
//         await expect(voting.connect(addr1).buyVote(2,{value: "200000000000000000"}));//0.2ether
//         await expect(voting.connect(addr1).cancelOrder(5)).to.be.revertedWith("requested cancel votes exceeded the total votes available");
//     });  

    
//     it("Can cancel the order if everything is okay", async function () {
//         await expect(voting.connect(addr1).buyVote(2,{value: "200000000000000000"}));//0.2ether
//         await expect(voting.connect(addr1).cancelOrder(2));
//         expect(await voting.userVoteBalance(addr1.address)).to.equal(0);
//     });

//     it("Can not vote if not enough vote", async function () {
//         await expect(voting.connect(addr1).buyVote(2,{value: "200000000000000000"}));//0.2ether
//         await expect(voting.connect(addr1).vote(3,addr1.address)).to.be.revertedWith("You can't vote more votes than you have!");
//     });

//     it("Can vote if everything is Ok", async function () {
//         await expect(voting.connect(addr1).createDogProfile("Nancy", "female", "2020-01-02", ["nice"], "I am a dog"));
//         await expect(voting.connect(addr1).buyVote(2,{value: "200000000000000000"}));//0.2ether
//         await expect(voting.connect(addr1).vote(1,addr1.address));
//         expect(await voting.userVoteBalance(addr1.address)).to.equal(1);
//         // console.log(await voting.adopt(addr1.address));
//         expect(await (voting.getAdoptDogVote(addr1.address))).to.equal(1);
//     });

//     it("Only the admin could access this function", async function () {
//         await expect(voting.connect(addr1).endVote()).to.be.revertedWith("only the admin can end vote");
//     });


//     it("Owner can end the votes if everything is okay", async function () {
//         const beforePurchaseBalance = await voting.connect(owner).getBalance();
//         await expect(voting.connect(addr1).createDogProfile("Nancy", "female", "2020-01-02", ["cute"], "I am a dog"));
//         await expect(voting.connect(addr1).buyVote(2,{value: "200000000000000000"}));//0.2ether
//         await expect(voting.connect(addr1).vote(2,addr1.address));
//         await expect(voting.connect(owner).endVote());
//         const afterPurchaseBalance = await voting.connect(owner).getBalance();
//         await expect(afterPurchaseBalance).to.equal(beforePurchaseBalance);
//     });

//     it("After owner end the votes, dogs's vote number should be reset to zero", async function () {

//         await expect(voting.connect(addr1).createDogProfile("Nancy", "female", "2020-01-02", ["cute"], "I am a dog"));
//         await expect(voting.connect(addr1).buyVote(2,{value: "200000000000000000"}));//0.2ether
//         await expect(voting.connect(addr1).vote(2,addr1.address));
//         await expect(voting.connect(owner).endVote());
//         expect(await (voting.getAdoptDogVote(addr1.address))).to.equal(0);
//     });

// });