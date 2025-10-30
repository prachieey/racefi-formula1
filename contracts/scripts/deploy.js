// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Get signers (first 3 accounts for testing)
  const [deployer, admin, withdrawer1, withdrawer2] = await ethers.getSigners();
  
  // Configuration
  const config = {
    // First signer will be the admin
    admin: admin.address,
    // Next two signers will be withdrawers
    withdrawers: [withdrawer1.address, withdrawer2.address],
    // Daily limit: 10 ETH (in wei)
    dailyLimit: ethers.parseEther("10"),
  };

  console.log("Deploying contracts with the following configuration:");
  console.log("Admin:", config.admin);
  console.log("Withdrawers:", config.withdrawers.join(", "));
  console.log("Daily Limit (ETH):", ethers.formatEther(config.dailyLimit));

  console.log("\nDeploying TokenWithdrawal contract...");
  
  // Deploy TokenWithdrawal contract
  const TokenWithdrawal = await hre.ethers.getContractFactory("TokenWithdrawal");
  const tokenWithdrawal = await TokenWithdrawal.deploy(
    config.admin,
    config.withdrawers,
    config.dailyLimit
  );
  
  await tokenWithdrawal.waitForDeployment();
  
  const contractAddress = await tokenWithdrawal.getAddress();
  console.log("\nTokenWithdrawal deployed to:", contractAddress);
  
  // Verify contract on Etherscan (if on a supported network)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\nVerifying contract on Etherscan...");
    try {
      // Wait for Etherscan to recognize the contract
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
          config.admin,
          config.withdrawers,
          config.dailyLimit
        ],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.log("Contract verification failed:", error.message);
    }
  }
  
  console.log("\nDeployment completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
