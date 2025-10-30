// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TokenWithdrawal
 * @dev A secure contract for managing token withdrawals with advanced security features
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
    
    // Events
    event WithdrawalRequested(
        bytes32 indexed requestId,
        address indexed tokenAddress,
        address indexed to,
        uint256 amount,
        bool isNative
    );
    event WithdrawalConfirmed(bytes32 indexed requestId, address indexed confirmer);
    event WithdrawalExecuted(
        bytes32 indexed requestId,
        address indexed tokenAddress,
        address indexed to,
        uint256 amount,
        bool isNative
    );
    event TokenRecovered(address indexed token, uint256 amount);
    event DailyLimitUpdated(uint256 newLimit);
    event EmergencyWithdrawn(address indexed token, address indexed to, uint256 amount, bool isNative);
    
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
     * @dev Request a token withdrawal (requires confirmation)
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
        
        emit WithdrawalRequested(requestId, tokenAddress, to, amount, false);
        emit WithdrawalConfirmed(requestId, msg.sender);
        
        return requestId;
    }
    
    /**
     * @dev Request a native token withdrawal (requires confirmation)
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
        
        emit WithdrawalRequested(requestId, address(0), to, amount, true);
        emit WithdrawalConfirmed(requestId, msg.sender);
        
        return requestId;
    }
    
    /**
     * @dev Confirm a withdrawal request
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
     * @dev Execute a confirmed withdrawal request after timelock
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
            request.amount,
            request.isNative
        );
    }
    
    /**
     * @dev Recover tokens sent by mistake to the contract
     */
    function recoverToken(address tokenAddress, uint256 tokenAmount) external onlyAdmin {
        require(tokenAddress != address(0), "Invalid token address");
        require(tokenAmount > 0, "Amount must be greater than zero");
        
        IERC20 token = IERC20(tokenAddress);
        bool success = token.transfer(msg.sender, tokenAmount);
        require(success, "Token recovery failed");

        emit TokenRecovered(tokenAddress, tokenAmount);
    }
    
    /**
     * @dev Emergency withdrawal (only when paused, for security reasons)
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
        
        emit EmergencyWithdrawn(tokenAddress, to, amount, isNative);
    }
    
    /**
     * @dev Update daily withdrawal limit (admin only)
     */
    function setDailyWithdrawalLimit(uint256 newLimit) external onlyAdmin {
        dailyWithdrawalLimit = newLimit;
        emit DailyLimitUpdated(newLimit);
    }
    
    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
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
