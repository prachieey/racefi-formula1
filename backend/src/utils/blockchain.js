import { ethers } from 'ethers';
import { ErrorResponse } from '../middleware/error.js';

// Initialize provider and signer
export const initProvider = () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_OR_ALCHEMY_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return { provider, wallet };
  } catch (error) {
    console.error('Error initializing provider:', error);
    throw new ErrorResponse('Failed to initialize blockchain provider', 500);
  }
};

// Get contract instance
export const getContract = (address, abi) => {
  try {
    const { wallet } = initProvider();
    return new ethers.Contract(address, abi, wallet);
  } catch (error) {
    console.error('Error getting contract instance:', error);
    throw new ErrorResponse('Failed to initialize contract', 500);
  }
};

// Get token balance
// Get token balance
export const getTokenBalance = async (tokenAddress, walletAddress) => {
  try {
    // ABI for ERC20 token balanceOf function
    const erc20Abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    
    const tokenContract = getContract(tokenAddress, erc20Abi);
    const balance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.utils.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw new ErrorResponse('Failed to fetch token balance', 500);
  }
};

// Format transaction receipt for response
export const formatTransactionReceipt = (receipt) => ({
  transactionHash: receipt.transactionHash,
  blockNumber: receipt.blockNumber,
  status: receipt.status === 1 ? 'success' : 'failed',
  gasUsed: receipt.gasUsed.toString(),
  to: receipt.to,
  from: receipt.from,
  contractAddress: receipt.contractAddress
});

// Generate a unique transaction ID
export const generateTransactionId = () => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
