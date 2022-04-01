require('chai')
  .use(require('chai-as-promised'))
  .should()

const puppyVote = artifacts.require("PuppyVote");

contract("PuppyVote", (accounts) => {
    let VotingShop;
    let voting;
    let owner = accounts[0];
    let addr1 = accounts[1];
    let addr2;
    
    beforeEach(async function () {
        //VotingShop = await puppyVote.new({from: owner});
        //[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        voting = await puppyVote.new({from: owner});;//admin = owner;
    });

    it("Should not create a dog profile if do not have dog name", async function () {
        await voting.createDogProfile("", "female", "2020-01-02", ["cute", "lovely"], "I am a dog").should.be.rejectedWith("Dog name can not be empty!");
    });

    it("Should create a dog profile if everything is OK", async function () {
        await voting.createDogProfile("Nancy", "female", "2020-01-02", ["nice"], "I am a dog");
        expect(await voting.getLastDogName()).to.be.eq("Nancy");
    });

    it("Should cannot buy vote if do not send enough money", async function () {
        await voting.buyVote(2,{value: "100000000000000000"}).should.be.rejectedWith("Not enough money");
    });

    // bug fixed
    it("Should buy vote if everything is OK", async function () {
        await voting.buyVote(2,{value:"200000000000000000", from: addr1});//0.2ether
        expect(Number(await voting.userVoteBalance(addr1))).to.be.eq(2);
        // console.log(addr1.getAddress());
        //console.log(await voting.connect(addr1).buyVote(2, {value: "200000000000000000"}));
    });  
    
    it("Could not cancel order if not enough vote", async function () {
        await voting.buyVote(2,{value:"200000000000000000", from: addr1});//0.2ether
        await voting.cancelOrder(5, {from: addr1}).should.be.rejectedWith("requested cancel votes exceeded the total votes available");
    });  

    
    it("Can cancel the order if everything is okay", async function () {
        await voting.buyVote(2,{value:"200000000000000000", from: addr1});//0.2ether
        await voting.cancelOrder(2, {from: addr1});
        expect(Number(await voting.userVoteBalance(addr1))).to.be.eq(0);
    });

    it("Can not vote if not enough vote", async function () {
        await voting.buyVote(2,{value:"200000000000000000", from: addr1});//0.2ether
        await voting.vote(3,addr1, {from: addr1}).should.be.rejectedWith("You can't vote more votes than you have!");
    });

    it("Can vote if everything is Ok", async function () {
        await voting.createDogProfile("Nancy", "female", "2020-01-02", ["nice"], "I am a dog");
        await voting.buyVote(2,{value:"200000000000000000", from: addr1});//0.2ether
        await voting.vote(1,addr1, {from: addr1})
        expect(Number(await voting.userVoteBalance(addr1))).to.be.eq(1);

        // console.log(await voting.adopt(addr1.address));
        expect(Number(await voting.getAdoptDogVote(addr1))).to.be.eq(1);
    });

    it("Only the admin could access this function", async function () {
        await voting.endVote({from: addr1}).should.be.rejectedWith("only the admin can end vote");
    });


    it("Owner can end the votes if everything is okay", async function () {
        
        const beforePurchaseBalance = await voting.getBalance({from: owner});
        await voting.createDogProfile("Nancy", "female", "2020-01-02", ["cute"], "I am a dog");
        await voting.buyVote(2,{value:"200000000000000000", from: addr1});//0.2ether
        await voting.vote(2,addr1, {from: addr1});
        await voting.endVote({from: owner});
        const afterPurchaseBalance = await voting.getBalance({from: owner});
        await expect(Number(afterPurchaseBalance)).to.be.eq(Number(beforePurchaseBalance));
    });

    it("After owner end the votes, dogs's vote number should be reset to zero", async function () {
        await voting.createDogProfile("Nancy", "female", "2020-01-02", ["cute"], "I am a dog");
        await voting.buyVote(2,{value:"200000000000000000", from: addr1});//0.2ether
        await voting.vote(2,addr1, {from: addr1});
        await voting.endVote({from: owner});
        expect(Number(await voting.getAdoptDogVote(addr1))).to.be.eq(0);
    });

});