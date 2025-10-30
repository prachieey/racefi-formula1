const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenWithdrawal", function () {
  it("Should deploy the contract", async function () {
    const [owner] = await ethers.getSigners();
    
    // Deploy the contract
    const TokenWithdrawal = await ethers.getContractFactory("TokenWithdrawal");
    const tokenWithdrawal = await TokenWithdrawal.deploy(
      owner.address,  // admin
      [owner.address], // withdrawers
      ethers.utils.parseEther("10") // daily limit
    );
    
    await tokenWithdrawal.deployed();
    
    // Basic assertion
    expect(await tokenWithdrawal.hasRole(ethers.constants.HashZero, owner.address)).to.be.true;
  });
});
