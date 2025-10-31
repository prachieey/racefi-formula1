import express from 'express';
import { body } from 'express-validator';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to import the contract JSON, provide fallback if not found
let TokenWithdrawal;
try {
  TokenWithdrawal = JSON.parse(readFileSync(new URL('../artifacts/contracts/TokenWithdrawal.sol/TokenWithdrawal.json', import.meta.url)));
} catch (error) {
  console.warn('Warning: Contract artifacts not found. Some features may not work.');
  console.warn('Please run "npx hardhat compile" in the contracts directory to generate the required artifacts.');
  // Provide a fallback empty ABI
  TokenWithdrawal = { 
    abi: [],
    // Add any other required properties with default values
    contractName: 'TokenWithdrawal',
    bytecode: '0x',
    deployedBytecode: '0x',
    methodIdentifiers: {}
  };
}

const router = express.Router();

// Initialize contract instance
const initContract = () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_OR_ALCHEMY_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      TokenWithdrawal.abi,
      wallet
    );
    return { provider, wallet, contract };
  } catch (error) {
    console.error('Error initializing contract:', error);
    throw new Error('Failed to initialize contract');
  }
};

// @route   GET api/v1/token/balance/:address
// @desc    Get token balance for an address
// @access  Public
router.get('/balance/:address', async (req, res) => {
  try {
    const { contract } = initContract();
    const balance = await contract.balanceOf(req.params.address);
    res.json({
      success: true,
      balance: ethers.utils.formatEther(balance)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   POST api/v1/token/withdraw
// @desc    Withdraw tokens
// @access  Private
router.post('/withdraw', [
  body('amount', 'Amount is required').not().isEmpty(),
  body('to', 'Recipient address is required').isEthereumAddress()
], async (req, res) => {
  try {
    const { contract } = initContract();
    const { amount, to } = req.body;
    
    // Convert amount to wei
    const amountInWei = ethers.utils.parseEther(amount);
    
    // Send transaction
    const tx = await contract.withdraw(to, amountInWei);
    await tx.wait();
    
    res.json({
      success: true,
      message: 'Withdrawal successful',
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || 'Withdrawal failed'
    });
  }
});

export default router;
