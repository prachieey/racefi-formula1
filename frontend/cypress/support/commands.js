// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to connect MetaMask wallet
Cypress.Commands.add('connectWallet', () => {
  cy.get('button:contains("Connect Wallet")').click();
  
  // Accept the connection in MetaMask
  cy.acceptMetamaskAccess().then(connected => {
    expect(connected).to.be.true;
  });
  
  // Wait for the wallet to be connected
  cy.get('.wallet-address', { timeout: 20000 }).should('be.visible');
});

// Command to fill and submit token withdrawal form
Cypress.Commands.add('submitTokenWithdrawal', (tokenAddress, amount, recipient) => {
  cy.get('input[placeholder="0x..."]').first().type(tokenAddress);
  cy.get('input[type="number"]').first().type(amount);
  cy.get('input[placeholder="0x..."]').eq(1).type(recipient);
  cy.contains('Withdraw Tokens').click();
});

// Command to fill and submit native currency withdrawal
Cypress.Commands.add('submitNativeWithdrawal', (amount, recipient) => {
  cy.get('input[placeholder="0.1"]').type(amount);
  cy.get('input[placeholder="0x..."]').last().type(recipient);
  cy.contains('Withdraw Native Currency').click();
});

// Command to confirm transaction in MetaMask
Cypress.Commands.add('confirmTransaction', () => {
  cy.confirmMetamaskTransaction().then(transactionResult => {
    expect(transactionResult).to.be.true;
  });
});

// Command to add a network to MetaMask
Cypress.Commands.add('setupMetamaskNetwork', (networkName = 'Localhost 8545') => {
  cy.setupMetamask(
    'test test test test test test test test test test test junk', // Default Hardhat mnemonic
    networkName,
    'http://localhost:8545',
    31337, // Chain ID for Hardhat
    false, // Don't show test networks
    false // Don't show test networks
  );
});
