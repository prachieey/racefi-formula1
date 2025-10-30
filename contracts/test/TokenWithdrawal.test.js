const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenWithdrawal", function () {
  let TokenWithdrawal, tokenWithdrawal, owner, admin, withdrawer1, withdrawer2, user, token;
  const DAILY_LIMIT = ethers.utils.parseEther("10");
  const WITHDRAWAL_DELAY = 2 * 24 * 60 * 60; // 2 days in seconds
  
  // Helper function to increase time in Hardhat Network
  const increaseTime = async (seconds) => {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
  };

  beforeEach(async function () {
    [owner, admin, withdrawer1, withdrawer2, user] = await ethers.getSigners();

    // Deploy a test ERC20 token
    const TestToken = await ethers.getContractFactory("TestToken");
    token = await TestToken.deploy("Test Token", "TST", ethers.parseEther("1000"));
    await token.waitForDeployment();

    // Deploy TokenWithdrawal contract
    TokenWithdrawal = await ethers.getContractFactory("TokenWithdrawal");
    tokenWithdrawal = await TokenWithdrawal.deploy(
      admin.address,
      [withdrawer1.address, withdrawer2.address],
      DAILY_LIMIT
    );
    await tokenWithdrawal.waitForDeployment();

    // Send some ETH to the contract
    await owner.sendTransaction({
      to: tokenWithdrawal.getAddress(),
      value: ethers.parseEther("5")
    });

    // Send some test tokens to the contract
    await token.transfer(tokenWithdrawal.getAddress(), ethers.parseEther("100"));
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await tokenWithdrawal.hasRole(ethers.ZeroHash, admin.address)).to.be.true;
    });

    it("Should set the right withdrawers", async function () {
      const WITHDRAWER_ROLE = await tokenWithdrawal.WITHDRAWER_ROLE();
      expect(await tokenWithdrawal.hasRole(WITHDRAWER_ROLE, withdrawer1.address)).to.be.true;
      expect(await tokenWithdrawal.hasRole(WITHDRAWER_ROLE, withdrawer2.address)).to.be.true;
    });

    it("Should set the right daily limit", async function () {
      expect(await tokenWithdrawal.dailyWithdrawalLimit()).to.equal(DAILY_LIMIT);
    });
  });

  describe("Withdrawals", function () {
    let requestId;
    const WITHDRAW_AMOUNT = ethers.parseEther("1");

    beforeEach(async function () {
      // Request a withdrawal
      const tx = await tokenWithdrawal.connect(withdrawer1).requestTokenWithdrawal(
        token.getAddress(),
        user.address,
        WITHDRAW_AMOUNT
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "WithdrawalRequested"
      );
      requestId = event.args.requestId;
    });

    it("Should allow withdrawers to confirm the request", async function () {
      await expect(tokenWithdrawal.connect(withdrawer2).confirmWithdrawal(requestId))
        .to.emit(tokenWithdrawal, "WithdrawalConfirmed")
        .withArgs(requestId, withdrawer2.address);
    });

    it("Should not allow non-withdrawers to confirm", async function () {
      await expect(
        tokenWithdrawal.connect(user).confirmWithdrawal(requestId)
      ).to.be.revertedWith("Caller is not a withdrawer");
    });

    it("Should not allow executing before timelock", async function () {
      // Second withdrawer confirms
      await tokenWithdrawal.connect(withdrawer2).confirmWithdrawal(requestId);
      
      // Try to execute before timelock
      await expect(
        tokenWithdrawal.executeWithdrawal(requestId)
      ).to.be.revertedWith("Timelock not expired");
    });

    it("Should execute withdrawal after timelock", async function () {
      // Second withdrawer confirms
      await tokenWithdrawal.connect(withdrawer2).confirmWithdrawal(requestId);
      
      // Fast forward time (2 days + 1 second)
      await increaseTime(WITHDRAWAL_DELAY + 1);
      
      // Execute withdrawal
      await expect(tokenWithdrawal.executeWithdrawal(requestId))
        .to.emit(tokenWithdrawal, "WithdrawalExecuted")
        .withArgs(
          requestId,
          await token.getAddress(),
          user.address,
          WITHDRAW_AMOUNT,
          false
        );
      
      // Check token balance
      expect(await token.balanceOf(user.address)).to.equal(WITHDRAW_AMOUNT);
    });

    it("Should enforce daily withdrawal limit", async function () {
      // Second withdrawer confirms
      await tokenWithdrawal.connect(withdrawer2).confirmWithdrawal(requestId);
      
      // Fast forward time (2 days + 1 second)
      await increaseTime(WITHDRAWAL_DELAY + 1);
      
      // First withdrawal (should succeed)
      await tokenWithdrawal.executeWithdrawal(requestId);
      
      // Request another withdrawal that would exceed the daily limit
      const largeAmount = DAILY_LIMIT - WITHDRAW_AMOUNT + ethers.parseEther("0.1");
      const tx = await tokenWithdrawal.connect(withdrawer1).requestTokenWithdrawal(
        token.getAddress(),
        user.address,
        largeAmount
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "WithdrawalRequested"
      );
      const newRequestId = event.args.requestId;
      
      // Confirm the new request
      await tokenWithdrawal.connect(withdrawer2).confirmWithdrawal(newRequestId);
      
      // Should fail as it exceeds the daily limit
      await expect(
        tokenWithdrawal.executeWithdrawal(newRequestId)
      ).to.be.revertedWith("Daily withdrawal limit exceeded");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow pausing the contract", async function () {
      await tokenWithdrawal.connect(admin).pause();
      expect(await tokenWithdrawal.paused()).to.be.true;
    });

    it("Should allow emergency withdrawals when paused", async function () {
      // Pause the contract
      await tokenWithdrawal.connect(admin).pause();
      
      // Perform emergency withdrawal
      const amount = ethers.parseEther("1");
      await expect(
        tokenWithdrawal.connect(admin).emergencyWithdraw(
          token.getAddress(),
          user.address,
          amount,
          false
        )
      ).to.emit(tokenWithdrawal, "EmergencyWithdrawn");
      
      // Check token balance
      expect(await token.balanceOf(user.address)).to.equal(amount);
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-admin to update daily limit", async function () {
      await expect(
        tokenWithdrawal.connect(user).setDailyWithdrawalLimit(ethers.parseEther("20"))
      ).to.be.reverted;
    });

    it("Should allow admin to update daily limit", async function () {
      const newLimit = ethers.parseEther("20");
      await tokenWithdrawal.connect(admin).setDailyWithdrawalLimit(newLimit);
      expect(await tokenWithdrawal.dailyWithdrawalLimit()).to.equal(newLimit);
    });
  });
});
