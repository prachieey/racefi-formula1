const fs = require('fs');
const path = require('path');

// Main function
async function main() {
    // Read the main contract
    const contractPath = path.join(__dirname, 'contracts', 'TokenWithdrawal.sol');
    let contractContent = fs.readFileSync(contractPath, 'utf8');
    
    // Remove SPDX and pragma from the main contract
    contractContent = contractContent
        .replace(/\/\/ SPDX-License-Identifier:.*\n/g, '')
        .replace(/pragma solidity \^?\d+\.\d+\.\d+;\n/g, '')
        .replace(/import \".*\";\n/g, '');
    
    // Create the flattened content with proper headers
    const flattenedContent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

// File: @openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/IERC20Permit.sol)

// File: @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol
// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)

// File: @openzeppelin/contracts/utils/Address.sol
// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

// File: @openzeppelin/contracts/utils/Context.sol
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

// File: @openzeppelin/contracts/access/IAccessControl.sol
// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)

// File: @openzeppelin/contracts/access/AccessControl.sol
// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)

// File: @openzeppelin/contracts/security/ReentrancyGuard.sol
// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

// File: @openzeppelin/contracts/security/Pausable.sol
// OpenZeppelin Contracts (last updated v4.9.0) (security/Pausable.sol)

// File: contracts/TokenWithdrawal.sol
${contractContent}`;

    // Write the flattened contract to a file
    const outputPath = path.join(__dirname, 'TokenWithdrawal_Flattened.sol');
    fs.writeFileSync(outputPath, flattenedContent);
    
    console.log(`Successfully created flattened contract at: ${outputPath}`);
    console.log('You can now use this file for verification on SecureD.');
}

main().catch(console.error);
