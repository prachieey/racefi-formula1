import { useState, useEffect } from 'react';
import './App.css';
import TokenWithdrawal from './components/TokenWithdrawal';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  useEffect(() => {
    // Load contract address from environment or local storage
    const savedAddress = localStorage.getItem('contractAddress');
    if (savedAddress) {
      setContractAddress(savedAddress);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
        });
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
  };

  const handleContractAddressChange = (e) => {
    const address = e.target.value;
    setContractAddress(address);
    localStorage.setItem('contractAddress', address);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Token Withdrawal dApp</h1>
        {!isConnected ? (
          <button onClick={connectWallet} className="connect-btn">
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <span className="wallet-address">
              {`${account.substring(0, 6)}...${account.substring(38)}`}
            </span>
          </div>
        )}
      </header>

      <main className="app-main">
        <div className="contract-address">
          <label htmlFor="contract-address">Contract Address:</label>
          <input
            id="contract-address"
            type="text"
            value={contractAddress}
            onChange={handleContractAddressChange}
            placeholder="Enter TokenWithdrawal contract address"
          />
        </div>

        {isConnected && contractAddress && (
          <TokenWithdrawal 
            contractAddress={contractAddress} 
            account={account} 
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Token Withdrawal dApp - Built with React & Hardhat</p>
      </footer>
    </div>
  );
}

export default App;
