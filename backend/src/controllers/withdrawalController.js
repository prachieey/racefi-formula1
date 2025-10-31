import asyncHandler from 'express-async-handler';
import Withdrawal from '../models/Withdrawal.js';
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

// @desc    Create a new withdrawal request
// @route   POST /api/v1/withdrawals
// @access  Private
export const createWithdrawal = asyncHandler(async (req, res) => {
  const { tokenAddress, amount, to } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!tokenAddress || !amount || !to) {
    res.status(400);
    throw new Error('Please provide token address, amount, and recipient address');
  }

  // Validate Ethereum address
  if (!ethers.utils.isAddress(to)) {
    res.status(400);
    throw new Error('Invalid recipient address');
  }

  // Create withdrawal request
  const withdrawal = await Withdrawal.create({
    user: userId,
    tokenAddress,
    amount: amount.toString(),
    to,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: withdrawal,
  });
});

// @desc    Get all withdrawals
// @route   GET /api/v1/withdrawals
// @access  Private/Admin
export const getWithdrawals = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  
  if (status) {
    query.status = status;
  }

  const withdrawals = await Withdrawal.find(query)
    .sort({ createdAt: -1 })
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: withdrawals.length,
    data: withdrawals,
  });
});

// @desc    Get single withdrawal
// @route   GET /api/v1/withdrawals/:id
// @access  Private
export const getWithdrawal = asyncHandler(async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!withdrawal) {
    res.status(404);
    throw new Error('Withdrawal not found');
  }

  // Make sure user is the owner or admin
  if (
    withdrawal.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    res.status(401);
    throw new Error('Not authorized to view this withdrawal');
  }

  res.status(200).json({
    success: true,
    data: withdrawal,
  });
});

// @desc    Confirm withdrawal
// @route   PUT /api/v1/withdrawals/:id/confirm
// @access  Private/Withdrawer
export const confirmWithdrawal = asyncHandler(async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    res.status(404);
    throw new Error('Withdrawal not found');
  }

  // Check if already confirmed by this user
  const hasConfirmed = withdrawal.confirmations.some(
    (conf) => conf.user.toString() === req.user.id
  );

  if (hasConfirmed) {
    res.status(400);
    throw new Error('Withdrawal already confirmed by this user');
  }

  // Add confirmation
  withdrawal.confirmations.push({ user: req.user.id });
  
  // Check if we have enough confirmations
  if (withdrawal.confirmations.length >= 2) { // Assuming 2 confirmations are needed
    withdrawal.status = 'confirmed';
    
    // Here you would typically execute the withdrawal on the blockchain
    try {
      const { contract } = initContract();
      const tx = await contract.withdraw(
        withdrawal.tokenAddress,
        withdrawal.to,
        ethers.utils.parseEther(withdrawal.amount.toString())
      );
      
      await tx.wait();
      withdrawal.status = 'executed';
      withdrawal.txHash = tx.hash;
    } catch (error) {
      console.error('Withdrawal execution failed:', error);
      throw new Error('Failed to execute withdrawal on blockchain');
    }
  }

  await withdrawal.save();

  res.status(200).json({
    success: true,
    data: withdrawal,
  });
});

// @desc    Cancel withdrawal
// @route   PUT /api/v1/withdrawals/:id/cancel
// @access  Private/Admin
export const cancelWithdrawal = asyncHandler(async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    res.status(404);
    throw new Error('Withdrawal not found');
  }

  // Only allow cancellation if not already executed or cancelled
  if (['executed', 'cancelled'].includes(withdrawal.status)) {
    res.status(400);
    throw new Error(`Cannot cancel withdrawal with status: ${withdrawal.status}`);
  }

  withdrawal.status = 'cancelled';
  await withdrawal.save();

  res.status(200).json({
    success: true,
    data: withdrawal,
  });
});

// @desc    Get withdrawals by user
// @route   GET /api/v1/users/me/withdrawals
// @access  Private
export const getMyWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Withdrawal.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: withdrawals.length,
    data: withdrawals,
  });
});
