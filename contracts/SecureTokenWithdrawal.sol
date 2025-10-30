// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin secure modules
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SecureTokenWithdrawal is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Constants
    uint256 public constant MIN_CONFIRMATIONS = 2;
    uint256 public constant MAX_CONFIRMATIONS = 10; // Prevent spam
    uint256 public constant MAX_TIMELOCK = 7 days;  // Max timelock

    // Settings
    uint256 public dailyLimit;
    uint256 public lastResetTimestamp;
    uint256 public totalWithdrawnToday;

    // Withdrawal Request Structure
    struct WithdrawalRequest {
        bytes32 id;                         // Unique ID
        address tokenAddress;               // native (address(0)) or ERC20
        address payable to;                 // Recipient
        uint256 amount;                     // Amount
        uint256 timestamp;                  // Creation time
        bool executed;                      // Already executed
        uint256 claimCount;                 // Number of confirmations
        uint256 timelockDuration;           // Lock duration
        address requester;                  // Who created
    }

    // Storage
    mapping(bytes32 => WithdrawalRequest) private requests;
    bytes32[] public requestIds;
    // Track approvals
    mapping(bytes32 => mapping(address => bool)) public approvals;

    // Events
    event RequestCreated(bytes32 indexed requestId, address indexed token, address indexed to, uint256 amount, uint256 timestamp);
    event RequestConfirmed(bytes32 indexed requestId, address indexed confirmer, uint256 claimCount);
    event RequestExecuted(bytes32 indexed requestId, address indexed token, address indexed to, uint256 amount);
    event RequestCancelled(bytes32 indexed requestId, address indexed canceler);
    event TokensRecovered(address indexed token, address indexed admin, uint256 amount);
    event DailyLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event ContractPaused(address indexed pauser);
    event ContractUnpaused(address indexed pauser);

    constructor(address admin, uint256 _dailyLimit) {
        require(admin != address(0), "Invalid admin");
        _setupRole(ADMIN_ROLE, admin);
        _setupRole(PAUSER_ROLE, admin);
        _setRoleAdmin(WITHDRAWER_ROLE, ADMIN_ROLE);
        dailyLimit = _dailyLimit;
        lastResetTimestamp = block.timestamp;
        totalWithdrawnToday = 0;
    }

    // Modifiers
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

    modifier onlyPauser() {
        require(hasRole(PAUSER_ROLE, msg.sender), "Not pauser");
        _;
    }

    modifier onlyWithdrawer() {
        require(hasRole(WITHDRAWER_ROLE, msg.sender), "Not withdrawer");
        _;
    }

    // Internal reset daily limits if needed
    function _resetDailyLimit() internal {
        if (block.timestamp - lastResetTimestamp >= 1 days) {
            lastResetTimestamp = block.timestamp;
            totalWithdrawnToday = 0;
        }
    }

    // Request ERC20 token withdrawal (auto-approve requester)
    function requestTokenWithdrawal(
        address token, 
        address payable to, 
        uint256 amount, 
        uint256 timelock
    ) external onlyWithdrawer whenNotPaused returns (bytes32) {
        require(token != address(0), "Invalid token");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount zero");
        require(timelock <= MAX_TIMELOCK, "Too long timelock");
        
        IERC20 tokenContract = IERC20(token);
        require(tokenContract.balanceOf(address(this)) >= amount, "Insufficient token");

        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, token, to, amount, msg.sender, requestIds.length));
        require(requests[requestId].timestamp == 0, "Request exists");

        requests[requestId] = WithdrawalRequest({
            id: requestId,
            tokenAddress: token,
            to: to,
            amount: amount,
            timestamp: block.timestamp,
            executed: false,
            claimCount: 1, // Auto-confirm by requester
            timelockDuration: timelock,
            requester: msg.sender
        });

        requestIds.push(requestId);
        approvals[requestId][msg.sender] = true;

        emit RequestCreated(requestId, token, to, amount, block.timestamp);
        emit RequestConfirmed(requestId, msg.sender, 1);

        return requestId;
    }

    // Request native token withdrawal
    function requestNativeWithdrawal(
        address payable to,
        uint256 amount,
        uint256 timelock
    ) external payable onlyWithdrawer whenNotPaused returns (bytes32) {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount zero");
        require(timelock <= MAX_TIMELOCK, "Too long timelock");
        require(address(this).balance >= amount, "Insufficient balance");

        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, address(0), to, amount, msg.sender, requestIds.length));
        require(requests[requestId].timestamp == 0, "Request exists");

        requests[requestId] = WithdrawalRequest({
            id: requestId,
            tokenAddress: address(0),
            to: to,
            amount: amount,
            timestamp: block.timestamp,
            executed: false,
            claimCount: 1, // Auto-confirm by requester
            timelockDuration: timelock,
            requester: msg.sender
        });

        requestIds.push(requestId);
        approvals[requestId][msg.sender] = true;

        emit RequestCreated(requestId, address(0), to, amount, block.timestamp);
        emit RequestConfirmed(requestId, msg.sender, 1);

        return requestId;
    }

    // Confirm a withdrawal request
    function confirmWithdrawal(bytes32 requestId) external onlyWithdrawer whenNotPaused {
        WithdrawalRequest storage request = requests[requestId];
        require(request.timestamp > 0, "Invalid request");
        require(!request.executed, "Already executed");
        require(!approvals[requestId][msg.sender], "Already confirmed");
        require(block.timestamp >= request.timestamp + request.timelockDuration, "Timelock not passed");

        approvals[requestId][msg.sender] = true;
        request.claimCount++;

        emit RequestConfirmed(requestId, msg.sender, request.claimCount);
    }

    // Execute a withdrawal request after enough confirmations
    function executeWithdrawal(bytes32 requestId) external nonReentrant whenNotPaused {
        WithdrawalRequest storage request = requests[requestId];
        require(request.timestamp > 0, "Invalid request");
        require(!request.executed, "Already executed");
        require(block.timestamp >= request.timestamp + request.timelockDuration, "Timelock not passed");
        require(request.claimCount >= MIN_CONFIRMATIONS, "Not enough confirmations");
        require(request.claimCount <= MAX_CONFIRMATIONS, "Too many confirmations");
        
        _resetDailyLimit();
        require(totalWithdrawnToday + request.amount <= dailyLimit, "Daily limit exceeded");
        
        request.executed = true;
        totalWithdrawnToday += request.amount;

        if (request.tokenAddress == address(0)) {
            // Native token transfer
            (bool success, ) = request.to.call{value: request.amount}("");
            require(success, "Transfer failed");
        } else {
            // ERC20 token transfer
            IERC20(request.tokenAddress).safeTransfer(request.to, request.amount);
        }

        emit RequestExecuted(requestId, request.tokenAddress, request.to, request.amount);
    }

    // Cancel a withdrawal request (only admin or requester before timelock)
    function cancelWithdrawal(bytes32 requestId) external {
        WithdrawalRequest storage request = requests[requestId];
        require(request.timestamp > 0, "Invalid request");
        require(!request.executed, "Already executed");
        
        bool isAdmin = hasRole(ADMIN_ROLE, msg.sender);
        bool isRequester = (request.requester == msg.sender);
        
        if (!isAdmin) {
            require(isRequester, "Not requester");
            require(block.timestamp < request.timestamp + request.timelockDuration, "Timelock passed");
        }

        request.executed = true; // Mark as executed to prevent further actions
        emit RequestCancelled(requestId, msg.sender);
    }

    // Recover ERC20 tokens (admin only)
    function recoverTokens(address tokenAddress, uint256 amount) external onlyAdmin {
        require(tokenAddress != address(0), "Invalid token");
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(amount <= balance, "Insufficient balance");
        
        token.safeTransfer(msg.sender, amount);
        emit TokensRecovered(tokenAddress, msg.sender, amount);
    }

    // Update daily withdrawal limit (admin only)
    function updateDailyLimit(uint256 newLimit) external onlyAdmin {
        require(newLimit > 0, "Invalid limit");
        emit DailyLimitUpdated(dailyLimit, newLimit);
        dailyLimit = newLimit;
    }

    // Pause the contract (pauser only)
    function pause() external onlyPauser {
        _pause();
        emit ContractPaused(msg.sender);
    }

    // Unpause the contract (pauser only)
    function unpause() external onlyPauser {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    // Get request details
    function getRequest(bytes32 requestId) external view returns (WithdrawalRequest memory) {
        return requests[requestId];
    }

    // Get total number of requests
    function getRequestCount() external view returns (uint256) {
        return requestIds.length;
    }

    // Get request ID by index
    function getRequestIdByIndex(uint256 index) external view returns (bytes32) {
        require(index < requestIds.length, "Index out of bounds");
        return requestIds[index];
    }

    // Check if a request is confirmed by a specific address
    function isConfirmedBy(bytes32 requestId, address confirmer) external view returns (bool) {
        return approvals[requestId][confirmer];
    }

    // Receive function to accept native tokens
    receive() external payable {}

    // Fallback function
    fallback() external payable {}
}
