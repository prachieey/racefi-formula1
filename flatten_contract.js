const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Install truffle-flattener if not already installed
try {
    require.resolve('truffle-flattener');
} catch (e) {
    console.log('Installing truffle-flattener...');
    spawnSync('npm', ['install', '-g', 'truffle-flattener'], { stdio: 'inherit' });
}

const { execSync } = require('child_process');

const contractPath = path.join(__dirname, 'contracts', 'TokenWithdrawalV2.sol');
const outputPath = path.join(__dirname, 'TokenWithdrawalV2_Flattened.sol');

console.log('Flattening contract...');

try {
    // Use truffle-flattener to flatten the contract
    const flattened = execSync(`truffle-flattener ${contractPath}`, { encoding: 'utf-8' });
    
    // Clean up the output
    let cleaned = flattened
        // Remove duplicate SPDX licenses
        .replace(/\/\/ SPDX-License-Identifier:.*\n/g, '')
        // Remove duplicate pragma solidity
        .replace(/pragma solidity \^?\d+\.\d+\.\d+;\n/g, '')
        // Remove duplicate imports
        .replace(/import \".*\";\n/g, '');
        
    // Add single SPDX and pragma at the top
    cleaned = '// SPDX-License-Identifier: MIT\n' +
             'pragma solidity ^0.8.0;\n\n' +
             '// File: @openzeppelin/contracts/token/ERC20/IERC20.sol\n' +
             '// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)\n\n' +
             '// File: @openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol\n' +
             '// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/IERC20Permit.sol)\n\n' +
             '// File: @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol\n' +
             '// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)\n\n' +
             '// File: @openzeppelin/contracts/utils/Address.sol\n' +
             '// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)\n\n' +
             '// File: @openzeppelin/contracts/utils/Context.sol\n' +
             '// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)\n\n' +
             '// File: @openzeppelin/contracts/access/IAccessControl.sol\n' +
             '// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)\n\n' +
             '// File: @openzeppelin/contracts/access/AccessControl.sol\n' +
             '// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)\n\n' +
             '// File: @openzeppelin/contracts/security/ReentrancyGuard.sol\n' +
             '// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)\n\n' +
             '// File: @openzeppelin/contracts/security/Pausable.sol\n' +
             '// OpenZeppelin Contracts (last updated v4.9.0) (security/Pausable.sol)\n\n' +
             '// File: contracts/TokenWithdrawalV2.sol\n' +
             cleaned;
    
    fs.writeFileSync(outputPath, cleaned);
    console.log(`Successfully flattened contract to ${outputPath}`);
} catch (error) {
    console.error('Error flattening contract:', error);
}
