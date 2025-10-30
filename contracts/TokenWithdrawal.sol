// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TokenWithdrawal
 * @dev A secure contract for managing token withdrawals with advanced security features including:
 * - Multi-signature requirements (2/3)
 * - 48-hour timelock on withdrawals
 * - Daily withdrawal limits
 * - Emergency pause functionality
 * - Role-based access control
 * - Protection against reentrancy attacks
 * 
 * Security Considerations:
 * - Requires at least 2 confirmations for withdrawals
 * - Implements a 48-hour timelock for all withdrawals
 * - Includes daily withdrawal limits to mitigate impact of key compromises
 * - Uses OpenZeppelin's battle-tested contracts for security-critical functionality
 */
contract TokenWithdrawal is AccessControl, ReentrancyGuard, Pausable {
    // Role definitions
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Withdrawal request structure
    struct WithdrawalRequest {
        address tokenAddress;
        address payable to;
        uint256 amount;
        uint256 timestamp;
        bool executed;
        bool isNative;
        mapping(address => bool) confirmations;
        uint256 confirmationCount;
    }
    
    // Contract state
    uint256 public constant MIN_CONFIRMATIONS = 2; // Minimum required confirmations
    uint256 public constant WITHDRAWAL_DELAY = 2 days; // 2-day timelock for withdrawals
    uint256 public dailyWithdrawalLimit; // Daily withdrawal limit in wei
    uint256 public lastWithdrawalDay;
    uint256 public totalWithdrawnToday;
    
    // Mappings
    mapping(bytes32 => WithdrawalRequest) public withdrawalRequests;
    bytes32[] public withdrawalRequestIds;
    mapping(address => bool) public isAdmin;
    
    // Events with enhanced parameters for better off-chain tracking
    event WithdrawalRequested(
        bytes32 indexed requestId,
        address indexed tokenAddress,
        address indexed to,
        address indexed requester,
        uint256 amount,
        bool isNative,
        uint256 timestamp
    );
    
    event WithdrawalConfirmed(
        bytes32 indexed requestId, 
        address indexed confirmer,
        uint256 confirmationCount,
        uint256 timestamp
    );
    
    event WithdrawalExecuted(
        bytes32 indexed requestId,
        address indexed tokenAddress,
        address indexed to,
        address executor,
        uint256 amount,
        bool isNative,
        uint256 timestamp
    );
    
    event TokenRecovered(
        address indexed token, 
        address indexed admin,
        uint256 amount,
        uint256 timestamp
    );
    
    event DailyLimitUpdated(
        address indexed admin,
        uint256 oldLimit,
        uint256 newLimit,
        uint256 timestamp
    );
    
    event EmergencyWithdrawn(
        address indexed admin,
        address indexed token, 
        address indexed to, 
        uint256 amount, 
        bool isNative,
        uint256 timestamp
    );
    
    event ContractPaused(
        address indexed pauser,
        uint256 timestamp
    );
    
    event ContractUnpaused(
        address indexed pauser,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }
    
    modifier onlyWithdrawer() {
        require(hasRole(WITHDRAWER_ROLE, msg.sender), "Caller is not a withdrawer");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _initialAdmin Address of the initial admin
     * @param _withdrawers Array of initial withdrawers
     * @param _dailyLimit Daily withdrawal limit in wei
     */
    constructor(address _initialAdmin, address[] memory _withdrawers, uint256 _dailyLimit) {
        require(_initialAdmin != address(0), "Invalid admin address");
        _setupRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
        _setupRole(PAUSER_ROLE, _initialAdmin);
        
        // Set up withdrawers
        for (uint i = 0; i < _withdrawers.length; i++) {
            require(_withdrawers[i] != address(0), "Invalid withdrawer address");
            _setupRole(WITHDRAWER_ROLE, _withdrawers[i]);
        }
        
        dailyWithdrawalLimit = _dailyLimit;
        lastWithdrawalDay = block.timestamp / 1 days;
    }
    
    /**
     * @notice Request a token withdrawal (requires confirmation)
     * @dev Creates a new withdrawal request that requires additional confirmations
     * @param tokenAddress Address of the ERC20 token to withdraw (address(0) for native currency)
     * @param to Address that will receive the tokens
     * @param amount Amount of tokens to withdraw (in wei/token decimals)
     * @return requestId Unique identifier for the withdrawal request
     * @custom:security Requires WITHDRAWER_ROLE and contract not to be paused
     * @custom:emits WithdrawalRequested, WithdrawalConfirmed
     */
    function requestTokenWithdrawal(
        address tokenAddress,
        address payable to,
        uint256 amount
    ) external onlyWithdrawer whenNotPaused returns (bytes32) {
        require(tokenAddress != address(0), "Invalid token address");
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");
        
        IERC20 token = IERC20(tokenAddress);
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient token balance");
        
        bytes32 requestId = keccak256(
            abi.encodePacked(
                block.timestamp,
                tokenAddress,
                to,
                amount,
                withdrawalRequestIds.length
            )
        );
        
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        request.tokenAddress = tokenAddress;
        request.to = to;
        request.amount = amount;
        request.timestamp = block.timestamp;
        request.executed = false;
        request.isNative = false;
        request.confirmations[msg.sender] = true;
        request.confirmationCount = 1;
        
        withdrawalRequestIds.push(requestId);
        
        emit WithdrawalRequested(
            requestId, 
            tokenAddress, 
            to, 
            msg.sender, 
            amount, 
            false,
            block.timestamp
        );
        emit WithdrawalConfirmed(
            requestId, 
            msg.sender, 
            1, // Initial confirmation count
            block.timestamp
        );
        
        return requestId;
    }
    
    /**
     * @notice Request a native token withdrawal (requires confirmation)
     * @dev Creates a new native token withdrawal request that requires additional confirmations
     * @param to Address that will receive the native tokens
     * @param amount Amount of native tokens to withdraw (in wei)
     * @return requestId Unique identifier for the withdrawal request
     * @custom:security Requires WITHDRAWER_ROLE and contract not to be paused
     * @custom:emits WithdrawalRequested, WithdrawalConfirmed
     */
    function requestNativeWithdrawal(
        address payable to,
        uint256 amount
    ) external onlyWithdrawer whenNotPaused returns (bytes32) {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient native balance");
        
        bytes32 requestId = keccak256(
            abi.encodePacked(
                block.timestamp,
                address(0),
                to,
                amount,
                withdrawalRequestIds.length
            )
        );
        
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        request.tokenAddress = address(0);
        request.to = to;
        request.amount = amount;
        request.timestamp = block.timestamp;
        request.executed = false;
        request.isNative = true;
        request.confirmations[msg.sender] = true;
        request.confirmationCount = 1;
        
        withdrawalRequestIds.push(requestId);
        
        emit WithdrawalRequested(
            requestId, 
            address(0), 
            to, 
            msg.sender, 
            amount, 
            true,
            block.timestamp
        );
        emit WithdrawalConfirmed(
            requestId, 
            msg.sender, 
            1, // Initial confirmation count
            block.timestamp
        );
        
        return requestId;
    }
    
    /**
     * @notice Confirm a pending withdrawal request
     * @dev Allows withdrawers to confirm pending withdrawal requests
     * @param requestId The ID of the withdrawal request to confirm
     * @custom:security Requires WITHDRAWER_ROLE, valid request ID, and contract not to be paused
     * @custom:emits WithdrawalConfirmed
     * @custom:reverts If request is already executed or already confirmed by this address
     */
    function confirmWithdrawal(bytes32 requestId) external onlyWithdrawer whenNotPaused {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        require(request.to != address(0), "Invalid request ID");
        require(!request.executed, "Request already executed");
        require(!request.confirmations[msg.sender], "Already confirmed");
        
        request.confirmations[msg.sender] = true;
        request.confirmationCount++;
        
        emit WithdrawalConfirmed(requestId, msg.sender);
    }
    
    /**
     * @notice Execute a confirmed withdrawal request after timelock period
     * @dev Processes the withdrawal if all conditions are met (timelock, confirmations, limits)
     * @param requestId The ID of the withdrawal request to execute
     * @custom:security Requires valid request ID, timelock expired, and sufficient confirmations
     * @custom:emits WithdrawalExecuted
     * @custom:reverts If conditions not met or transfer fails
     */
    function executeWithdrawal(bytes32 requestId) external nonReentrant whenNotPaused {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        require(request.to != address(0), "Invalid request ID");
        require(!request.executed, "Request already executed");
        require(block.timestamp >= request.timestamp + WITHDRAWAL_DELAY, "Timelock not expired");
        require(request.confirmationCount >= MIN_CONFIRMATIONS, "Insufficient confirmations");
        
        // Update daily withdrawal tracking
        _updateDailyWithdrawal();
        require(
            totalWithdrawnToday + request.amount <= dailyWithdrawalLimit,
            "Daily withdrawal limit exceeded"
        );
        
        request.executed = true;
        totalWithdrawnToday += request.amount;
        
        if (request.isNative) {
            (bool success, ) = request.to.call{value: request.amount}("");
            require(success, "Native transfer failed");
        } else {
            IERC20 token = IERC20(request.tokenAddress);
            bool success = token.transfer(request.to, request.amount);
            require(success, "Token transfer failed");
        }
        
        emit WithdrawalExecuted(
            requestId,
            request.tokenAddress,
            request.to,
            msg.sender, // Executor
            request.amount,
            request.isNative,
            block.timestamp
        );
    }
    
    /**
     * @notice Recover ERC20 tokens sent by mistake to the contract
     * @dev Allows admin to recover ERC20 tokens sent to the contract
     * @param tokenAddress Address of the token to recover
     * @param tokenAmount Amount of tokens to recover
     * @custom:security Requires DEFAULT_ADMIN_ROLE
     * @custom:emits TokenRecovered
     * @custom:reverts If token address is zero, amount is zero, or transfer fails
     */
    function recoverToken(address tokenAddress, uint256 tokenAmount) external onlyAdmin {
        require(tokenAddress != address(0), "Invalid token address");
        require(tokenAmount > 0, "Amount must be greater than zero");
        
        IERC20 token = IERC20(tokenAddress);
        bool success = token.transfer(msg.sender, tokenAmount);
        require(success, "Token recovery failed");

        emit TokenRecovered(
            tokenAddress, 
            msg.sender, 
            tokenAmount,
            block.timestamp
        );
    }
    
    /**
     * @notice Emergency withdrawal function (only when paused)
     * @dev Allows admin to withdraw funds in case of emergency (contract must be paused)
     * @param tokenAddress Address of the token to withdraw (address(0) for native currency)
     * @param to Address that will receive the tokens
     * @param amount Amount of tokens to withdraw
     * @param isNative Whether the withdrawal is for native currency
     * @custom:security Requires DEFAULT_ADMIN_ROLE and contract to be paused
     * @custom:emits EmergencyWithdrawn
     * @custom:reverts If conditions not met or transfer fails
     */
    function emergencyWithdraw(
        address tokenAddress,
        address payable to,
        uint256 amount,
        bool isNative
    ) external onlyAdmin whenPaused {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");
        
        if (isNative) {
            require(address(this).balance >= amount, "Insufficient native balance");
            (bool success, ) = to.call{value: amount}("");
            require(success, "Native transfer failed");
        } else {
            IERC20 token = IERC20(tokenAddress);
            uint256 contractBalance = token.balanceOf(address(this));
            require(contractBalance >= amount, "Insufficient token balance");
            bool success = token.transfer(to, amount);
            require(success, "Token transfer failed");
        }
        
        emit EmergencyWithdrawn(
            msg.sender,
            tokenAddress, 
            to, 
            amount, 
            isNative,
            block.timestamp
        );
    }
    
    /**
     * @notice Update the daily withdrawal limit
     * @dev Allows admin to adjust the daily withdrawal limit
     * @param newLimit New daily withdrawal limit in wei
     * @custom:security Requires DEFAULT_ADMIN_ROLE
     * @custom:emits DailyLimitUpdated
     */
    function setDailyWithdrawalLimit(uint256 newLimit) external onlyAdmin {
        uint256 oldLimit = dailyWithdrawalLimit;
        dailyWithdrawalLimit = newLimit;
        emit DailyLimitUpdated(
            msg.sender,
            oldLimit,
            newLimit,
            block.timestamp
        );
    }
    
    /**
     * @notice Pause contract (emergency only)
     * @dev Pauses all withdrawal operations in case of emergency
     * @custom:security Requires PAUSER_ROLE
     * @custom:emits ContractPaused
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit ContractPaused(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Unpause contract
     * @dev Resumes all withdrawal operations
     * @custom:security Requires PAUSER_ROLE
     * @custom:emits ContractUnpaused
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit ContractUnpaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Internal function to update daily withdrawal tracking
     */
    function _updateDailyWithdrawal() internal {
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastWithdrawalDay) {
            lastWithdrawalDay = currentDay;
            totalWithdrawnToday = 0;
        }
    }
    
    // Allow the contract to receive native currency
    receive() external payable {}
}
