import { useState } from 'react';
import { ethers } from 'ethers';
import TokenWithdrawalABI from '../../contracts/artifacts/contracts/TokenWithdrawal.sol/TokenWithdrawal.json';

const TokenWithdrawal = ({ contractAddress, account }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nativeAmount, setNativeAmount] = useState('');
  const [nativeRecipient, setNativeRecipient] = useState('');

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  
  // Check if connected account is the owner
  const checkOwner = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, TokenWithdrawalABI.abi, await signer);
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.error('Error checking owner:', error);
      setStatus('Error checking contract ownership');
    }
  };

  // Withdraw ERC20 tokens
  const handleWithdrawToken = async (e) => {
    e.preventDefault();
    if (!isOwner) {
      setStatus('Only contract owner can withdraw tokens');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('Processing transaction...');
      
      const contract = new ethers.Contract(contractAddress, TokenWithdrawalABI.abi, await signer);
      const tx = await contract.withdrawToken(
        tokenAddress,
        recipient,
        ethers.parseUnits(amount, 18) // Assuming 18 decimals
      );
      
      await tx.wait();
      setStatus('Token withdrawal successful!');
      setTokenAddress('');
      setAmount('');
      setRecipient('');
    } catch (error) {
      console.error('Error withdrawing token:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw native currency (ETH/BNB/MATIC)
  const handleWithdrawNative = async (e) => {
    e.preventDefault();
    if (!isOwner) {
      setStatus('Only contract owner can withdraw native currency');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('Processing native currency withdrawal...');
      
      const contract = new ethers.Contract(contractAddress, TokenWithdrawalABI.abi, await signer);
      const tx = await contract.withdrawNative(
        nativeRecipient,
        ethers.parseEther(nativeAmount)
      );
      
      await tx.wait();
      setStatus('Native currency withdrawal successful!');
      setNativeAmount('');
      setNativeRecipient('');
    } catch (error) {
      console.error('Error withdrawing native currency:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check owner when component mounts or account changes
  useState(() => {
    if (contractAddress && account) {
      checkOwner();
    }
  }, [contractAddress, account]);

  return (
    <div className="token-withdrawal">
      <h2>Token Withdrawal</h2>
      {!isOwner ? (
        <p className="warning">Connected wallet is not the owner of this contract</p>
      ) : (
        <p className="success">Connected as contract owner</p>
      )}

      <div className="card">
        <h3>Withdraw ERC20 Tokens</h3>
        <form onSubmit={handleWithdrawToken}>
          <div className="form-group">
            <label>Token Address:</label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              step="0.000000000000000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.0"
              required
            />
          </div>
          <div className="form-group">
            <label>Recipient Address:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          <button type="submit" disabled={!isOwner || isLoading}>
            {isLoading ? 'Processing...' : 'Withdraw Tokens'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Withdraw Native Currency</h3>
        <form onSubmit={handleWithdrawNative}>
          <div className="form-group">
            <label>Amount (ETH/BNB/MATIC):</label>
            <input
              type="number"
              step="0.000000000000000001"
              value={nativeAmount}
              onChange={(e) => setNativeAmount(e.target.value)}
              placeholder="0.1"
              required
            />
          </div>
          <div className="form-group">
            <label>Recipient Address:</label>
            <input
              type="text"
              value={nativeRecipient}
              onChange={(e) => setNativeRecipient(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          <button type="submit" disabled={!isOwner || isLoading}>
            {isLoading ? 'Processing...' : 'Withdraw Native Currency'}
          </button>
        </form>
      </div>

      {status && <div className="status">{status}</div>}
    </div>
  );
};

export default TokenWithdrawal;
