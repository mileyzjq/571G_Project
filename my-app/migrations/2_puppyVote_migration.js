const PuppyVote = artifacts.require("PuppyVote");
module.exports = async (deployer, network, accounts) => {
  //let myERC20Token = await deployer.deploy(MyERC20Token, 'Animal Coin', 'AnCoin', '10000');
  let puppyVote = await deployer.deploy(PuppyVote);
};    