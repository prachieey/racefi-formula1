const fs = require('fs');
const path = require('path');

// Read the original file
const contractPath = path.join(__dirname, 'TokenWithdrawal.sol');
const flattenedPath = path.join(__dirname, 'TokenWithdrawalFlattened.sol');

// Read the contract content
fs.readFile(contractPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    
    // Write to the flattened file
    fs.writeFile(flattenedPath, data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Successfully created flattened file at:', flattenedPath);
    });
});
