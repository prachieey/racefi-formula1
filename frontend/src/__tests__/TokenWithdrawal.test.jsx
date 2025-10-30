import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TokenWithdrawal from '../components/TokenWithdrawal';

// Mock the ethers module
jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  ethers: {
    ...jest.requireActual('ethers').ethers,
    Contract: jest.fn().mockImplementation(() => ({
      owner: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890'),
      withdrawToken: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({}),
      }),
      withdrawNative: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({}),
      }),
    })),
    providers: {
      Web3Provider: jest.fn().mockImplementation(() => ({
        getSigner: jest.fn().mockReturnValue({
          getAddress: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890'),
        }),
      })),
    },
  },
}));

describe('TokenWithdrawal Component', () => {
  const mockProps = {
    contractAddress: '0xContractAddress',
    account: '0x1234567890123456789012345678901234567890',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with token withdrawal form', () => {
    render(<TokenWithdrawal {...mockProps} />);
    
    expect(screen.getByText('Token Withdrawal')).toBeInTheDocument();
    expect(screen.getByText('Withdraw ERC20 Tokens')).toBeInTheDocument();
    expect(screen.getByText('Withdraw Native Currency')).toBeInTheDocument();
  });

  it('shows owner status when connected account is the owner', async () => {
    render(<TokenWithdrawal {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Connected as contract owner')).toBeInTheDocument();
    });
  });

  it('handles token withdrawal form submission', async () => {
    render(<TokenWithdrawal {...mockProps} />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Token Address:'), {
      target: { value: '0xTokenAddress' },
    });
    fireEvent.change(screen.getByLabelText('Amount:'), {
      target: { value: '1.5' },
    });
    fireEvent.change(screen.getByLabelText('Recipient Address:'), {
      target: { value: '0xRecipientAddress' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Withdraw Tokens'));

    // Check if the status message appears
    await waitFor(() => {
      expect(screen.getByText('Processing transaction...')).toBeInTheDocument();
    });
  });

  it('handles native currency withdrawal form submission', async () => {
    render(<TokenWithdrawal {...mockProps} />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Amount (ETH/BNB/MATIC):'), {
      target: { value: '0.1' },
    });
    fireEvent.change(screen.getAllByLabelText('Recipient Address:')[1], {
      target: { value: '0xRecipientAddress' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Withdraw Native Currency'));

    // Check if the status message appears
    await waitFor(() => {
      expect(screen.getByText('Processing native currency withdrawal...')).toBeInTheDocument();
    });
  });

  it('shows error when not connected as owner', async () => {
    // Mock the contract's owner to be different from the connected account
    const mockContract = {
      owner: jest.fn().mockResolvedValue('0xDifferentOwnerAddress'),
    };
    require('ethers').ethers.Contract = jest.fn().mockImplementation(() => mockContract);

    render(<TokenWithdrawal {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Connected wallet is not the owner of this contract')).toBeInTheDocument();
    });
  });

  it('handles form validation', async () => {
    render(<TokenWithdrawal {...mockProps} />);
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText('Withdraw Tokens'));
    
    // Check for validation messages
    await waitFor(() => {
      const requiredInputs = document.querySelectorAll('input:required');
      requiredInputs.forEach(input => {
        expect(input).toBeInvalid();
      });
    });
  });
});
