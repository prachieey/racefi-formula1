// @ts-nocheck
/// <reference types="Cypress" />

describe('Token Withdrawal dApp', () => {
  // Contract address will be set after deployment
  let contractAddress = '';
  
  // Test account details
  const testAccount = {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // First Hardhat account
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  };

  before(() => {
    // Setup MetaMask with the local Hardhat network
    cy.setupMetamaskNetwork('Hardhat');
    
    // Deploy the contract before running tests
    cy.exec('cd ../contracts && npx hardhat run scripts/deploy.js --network localhost')
      .then((result) => {
        // Extract the contract address from the deployment output
        const match = result.stdout.match(/TokenWithdrawal deployed to: (0x[a-fA-F0-9]+)/);
        if (match && match[1]) {
          contractAddress = match[1];
          cy.log(`Contract deployed at: ${contractAddress}`);
        } else {
          throw new Error('Could not extract contract address from deployment output');
        }
      });
  });

  beforeEach(() => {
    // Start from the home page for each test
    cy.visit('/');
  });

  it('should connect wallet and display account address', () => {
    // Check that the connect button is visible
    cy.get('button').contains('Connect Wallet').should('be.visible');
    
    // Connect the wallet
    cy.connectWallet();
    
    // Check that the wallet address is displayed (truncated)
    cy.get('.wallet-address').should('contain', '0xf39F...2266');
  });

  it('should allow entering a contract address', () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    
    // Type the contract address
    cy.get('input[placeholder*="contract address"]')
      .type(testAddress)
      .should('have.value', testAddress);
  });

  it('should display the token withdrawal form after connecting wallet and entering contract address', () => {
    // Connect wallet
    cy.connectWallet();
    
    // Enter contract address
    cy.get('input[placeholder*="contract address"]')
      .type(contractAddress);
    
    // Check that the token withdrawal form is visible
    cy.contains('Withdraw ERC20 Tokens').should('be.visible');
    cy.contains('Withdraw Native Currency').should('be.visible');
  });

  it('should show validation errors for invalid form inputs', () => {
    // Connect wallet and enter contract address
    cy.connectWallet();
    cy.get('input[placeholder*="contract address"]').type(contractAddress);
    
    // Try to submit empty form
    cy.contains('Withdraw Tokens').click();
    
    // Check for validation messages
    cy.get('input:invalid').should('have.length', 3); // 3 required fields
  });

  it('should submit a token withdrawal transaction', () => {
    // Test data
    const tokenAddress = '0x0000000000000000000000000000000000000001';
    const amount = '1.5';
    const recipient = '0x0000000000000000000000000000000000000002';
    
    // Connect wallet and enter contract address
    cy.connectWallet();
    cy.get('input[placeholder*="contract address"]').type(contractAddress);
    
    // Fill and submit the form
    cy.submitTokenWithdrawal(tokenAddress, amount, recipient);
    
    // Confirm the transaction in MetaMask
    cy.confirmTransaction();
    
    // Check for success message
    cy.contains('Token withdrawal successful', { timeout: 30000 }).should('be.visible');
  });

  it('should submit a native currency withdrawal transaction', () => {
    // Test data
    const amount = '0.1';
    const recipient = '0x0000000000000000000000000000000000000003';
    
    // Connect wallet and enter contract address
    cy.connectWallet();
    cy.get('input[placeholder*="contract address"]').type(contractAddress);
    
    // Fill and submit the form
    cy.submitNativeWithdrawal(amount, recipient);
    
    // Confirm the transaction in MetaMask
    cy.confirmTransaction();
    
    // Check for success message
    cy.contains('Native currency withdrawal successful', { timeout: 30000 }).should('be.visible');
  });

  it('should show an error when trying to withdraw without being the owner', () => {
    // This test assumes the connected wallet is not the owner
    // We'll use a different account for this test
    
    // Import a different account that's not the owner
    cy.importMetamaskAccount('0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a');
    
    // Connect to the new account
    cy.switchMetamaskAccount(1);
    
    // Connect wallet and enter contract address
    cy.connectWallet();
    cy.get('input[placeholder*="contract address"]').type(contractAddress);
    
    // Try to withdraw tokens (should fail as not the owner)
    cy.submitTokenWithdrawal(
      '0x0000000000000000000000000000000000000001',
      '1',
      '0x0000000000000000000000000000000000000004'
    );
    
    // Check for error message
    cy.contains('Only contract owner can withdraw tokens', { timeout: 10000 }).should('be.visible');
  });
});
