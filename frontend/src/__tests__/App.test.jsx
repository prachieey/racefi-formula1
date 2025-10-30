import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the MetaMask provider
global.ethereum = {
  isMetaMask: true,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks and reset localStorage before each test
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders the app with connect wallet button', () => {
    render(<App />);
    
    expect(screen.getByText('Token Withdrawal dApp')).toBeInTheDocument();
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('connects wallet when connect button is clicked', async () => {
    // Mock the ethereum.request method
    global.ethereum.request = jest.fn()
      .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']);
    
    render(<App />);
    
    // Click the connect wallet button
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    // Check if wallet connection was attempted
    await waitFor(() => {
      expect(global.ethereum.request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
    });
    
    // Check if the wallet address is displayed (truncated)
    expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
  });

  it('saves and loads contract address from localStorage', () => {
    const testAddress = '0xContractAddress123';
    
    // First render - no saved address
    const { rerender } = render(<App />);
    
    // Enter a contract address
    const input = screen.getByPlaceholderText('Enter TokenWithdrawal contract address');
    fireEvent.change(input, { target: { value: testAddress } });
    
    // Re-render the component
    rerender(<App />);
    
    // Check if the input retains its value
    expect(input).toHaveValue(testAddress);
  });

  it('shows error when MetaMask is not installed', async () => {
    // Remove the ethereum object to simulate MetaMask not being installed
    const originalEthereum = global.ethereum;
    delete global.ethereum;
    
    // Mock window.alert
    const originalAlert = window.alert;
    window.alert = jest.fn();
    
    render(<App />);
    
    // Click the connect wallet button
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    // Check if alert was shown
    expect(window.alert).toHaveBeenCalledWith('Please install MetaMask to use this dApp!');
    
    // Restore the original ethereum object and alert function
    global.ethereum = originalEthereum;
    window.alert = originalAlert;
  });

  it('handles account changes', async () => {
    // Mock the ethereum.on method to simulate account changes
    let accountChangeCallback;
    global.ethereum.on = jest.fn((event, callback) => {
      if (event === 'accountsChanged') {
        accountChangeCallback = callback;
      }
    });
    
    // Mock the initial account
    global.ethereum.request = jest.fn()
      .mockResolvedValueOnce(['0x1111111111111111111111111111111111111111']);
    
    render(<App />);
    
    // Connect the wallet
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    // Simulate an account change
    act(() => {
      accountChangeCallback(['0x2222222222222222222222222222222222222222']);
    });
    
    // Check if the UI updated with the new account
    await waitFor(() => {
      expect(screen.getByText('0x2222...2222')).toBeInTheDocument();
    });
  });
});

// Helper function to wrap code that causes state updates in act()
const act = async (callback) => {
  const { act: reactAct } = await import('@testing-library/react');
  return await reactAct(async () => {
    await callback();
  });
};
