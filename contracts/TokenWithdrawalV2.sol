// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title TokenWithdrawal (improved/fixed)
/// @notice Multi-sig withdrawer contract with timelock, daily limits, pause, and safe token handling.
/// @dev Changes vs original:
///   - ensures enough withdrawers exist for required confirmations
///   - avoids duplicate grant of roles
///   - small helpers to read ids/count
contract TokenWithdrawal is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Minimum confirmations and timelock
    uint256 public constant MIN_CONFIRMATIONS = 2;
    uint256 public constant WITHDRAWAL_DELAY = 2 days;

    // Daily limit (applies to raw uint256 amounts across tokens/native)
    uint256 public dailyWithdrawalLimit;
    uint256 public lastWithdrawalDay;
    uint256 public totalWithdrawnToday;

    // Request nonce to avoid id collisions
    uint256 private requestNonce;

    // Withdrawal request struct (no nested mapping)
    struct WithdrawalRequest {
        bytes32 id;
        address tokenAddress; // address(0) for native
        address payable to;
        uint256 amount;
        uint256 timestamp;
        bool executed;
        bool isNative;
        address requester;
        uint256 confirmationCount;
    }

    // Storage
    mapping(bytes32 => WithdrawalRequest) private withdrawalRequests;
    bytes32[] public withdrawalRequestIds;

    // confirmations stored externally to avoid nested mapping in struct (and allow public getters)
    mapping(bytes32 => mapping(address => bool)) public confirmations;

    // Events (max 3 indexed topics)
    event WithdrawalRequested(
        bytes32 indexed requestId,
        address indexed tokenAddress,
        address indexed to,
        address requester,
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

    event ContractPaused(address indexed pauser, uint256 timestamp);
    event ContractUnpaused(address indexed pauser, uint256 timestamp);
    event RequestCanceled(bytes32 indexed requestId, address indexed canceledBy, uint256 timestamp);

    // Modifiers
    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyWithdrawer() {
        require(hasRole(WITHDRAWER_ROLE, msg.sender), "Caller is not a withdrawer");
        _;
    }

    constructor(address _initialAdmin, address[] memory _withdrawers, uint256 _dailyLimit) {
        require(_initialAdmin != address(0), "Invalid admin");
        require(_withdrawers.length >= MIN_CONFIRMATIONS, "Not enough withdrawers");

        // grant admin roles
        _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
        _grantRole(PAUSER_ROLE, _initialAdmin);

        // grant withdrawer role, avoid duplicates
        // small local map to track duplicates (in-memory only)
        for (uint256 i = 0; i < _withdrawers.length; i++) {
            address w = _withdrawers[i];
            require(w != address(0), "Invalid withdrawer");
            if (!hasRole(WITHDRAWER_ROLE, w)) {
                _grantRole(WITHDRAWER_ROLE, w);
            }
        }

        dailyWithdrawalLimit = _dailyLimit;
        lastWithdrawalDay = block.timestamp / 1 days;
        requestNonce = 1;
    }

    /// @notice Request ERC20 token withdrawal (creates a request and auto-confirms by requester)
    function requestTokenWithdrawal(address tokenAddress, address payable to, uint256 amount)
        external
        onlyWithdrawer
        whenNotPaused
        returns (bytes32)
    {
        require(tokenAddress != address(0), "Invalid token");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount>0");

        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");

        // create unique id using nonce
        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, tokenAddress, to, amount, requestNonce));
        requestNonce++;

        WithdrawalRequest storage r = withdrawalRequests[requestId];
        require(r.timestamp == 0, "Request already exists"); // avoid accidentally overwriting
        r.id = requestId;
        r.tokenAddress = tokenAddress;
        r.to = to;
        r.amount = amount;
        r.timestamp = block.timestamp;
        r.executed = false;
        r.isNative = false;
        r.requester = msg.sender;
        r.confirmationCount = 1;

        confirmations[requestId][msg.sender] = true;

        withdrawalRequestIds.push(requestId);

        emit WithdrawalRequested(requestId, tokenAddress, to, msg.sender, amount, false, block.timestamp);
        emit WithdrawalConfirmed(requestId, msg.sender, 1, block.timestamp);

        return requestId;
    }

    /// @notice Request native (ETH) withdrawal
    function requestNativeWithdrawal(address payable to, uint256 amount)
        external
        onlyWithdrawer
        whenNotPaused
        returns (bytes32)
    {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount>0");
        require(address(this).balance >= amount, "Insufficient native balance");

        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, address(0), to, amount, requestNonce));
        requestNonce++;

        WithdrawalRequest storage r = withdrawalRequests[requestId];
        require(r.timestamp == 0, "Request already exists");
        r.id = requestId;
        r.tokenAddress = address(0);
        r.to = to;
        r.amount = amount;
        r.timestamp = block.timestamp;
        r.executed = false;
        r.isNative = true;
        r.requester = msg.sender;
        r.confirmationCount = 1;

        confirmations[requestId][msg.sender] = true;

        withdrawalRequestIds.push(requestId);

        emit WithdrawalRequested(requestId, address(0), to, msg.sender, amount, true, block.timestamp);
        emit WithdrawalConfirmed(requestId, msg.sender, 1, block.timestamp);

        return requestId;
    }

    /// @notice Confirm a pending request
    function confirmWithdrawal(bytes32 requestId) external onlyWithdrawer whenNotPaused {
        WithdrawalRequest storage r = withdrawalRequests[requestId];
        require(r.timestamp != 0, "Invalid request");
        require(!r.executed, "Already executed");
        require(!confirmations[requestId][msg.sender], "Already confirmed");

        confirmations[requestId][msg.sender] = true;
        r.confirmationCount++;

        emit WithdrawalConfirmed(requestId, msg.sender, r.confirmationCount, block.timestamp);
    }

    /// @notice Execute a confirmed request after timelock
    function executeWithdrawal(bytes32 requestId) external nonReentrant whenNotPaused {
        WithdrawalRequest storage r = withdrawalRequests[requestId];
        require(r.timestamp != 0, "Invalid request");
        require(!r.executed, "Already executed");
        require(block.timestamp >= r.timestamp + WITHDRAWAL_DELAY, "Timelock not expired");
        require(r.confirmationCount >= MIN_CONFIRMATIONS, "Insufficient confirmations");

        _updateDailyWithdrawal();
        require(totalWithdrawnToday + r.amount <= dailyWithdrawalLimit, "Daily limit exceeded");

        r.executed = true;
        totalWithdrawnToday += r.amount;

        if (r.isNative) {
            (bool ok, ) = r.to.call{value: r.amount}("");
            require(ok, "Native transfer failed");
        } else {
            IERC20(r.tokenAddress).safeTransfer(r.to, r.amount);
        }

        emit WithdrawalExecuted(requestId, r.tokenAddress, r.to, msg.sender, r.amount, r.isNative, block.timestamp);
    }

    /// @notice Cancel a request (by requester or admin) if not executed
    function cancelRequest(bytes32 requestId) external {
        WithdrawalRequest storage r = withdrawalRequests[requestId];
        require(r.timestamp != 0, "Invalid request");
        require(!r.executed, "Already executed");
        require(msg.sender == r.requester || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");

        // mark executed to prevent reuse
        r.executed = true;

        emit RequestCanceled(requestId, msg.sender, block.timestamp);
    }

    /// @notice Recover ERC20 tokens accidentally sent to contract (admin only)
    function recoverToken(address tokenAddress, uint256 tokenAmount) external onlyAdmin {
        require(tokenAddress != address(0), "Invalid token");
        require(tokenAmount > 0, "Amount>0");

        IERC20(tokenAddress).safeTransfer(msg.sender, tokenAmount);
        emit TokenRecovered(tokenAddress, msg.sender, tokenAmount, block.timestamp);
    }

    /// @notice Emergency withdraw when paused (admin)
    function emergencyWithdraw(address tokenAddress, address payable to, uint256 amount, bool isNative)
        external
        onlyAdmin
        whenPaused
    {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount>0");

        if (isNative) {
            require(address(this).balance >= amount, "Insufficient native");
            (bool ok, ) = to.call{value: amount}("");
            require(ok, "Native transfer failed");
        } else {
            IERC20 token = IERC20(tokenAddress);
            require(token.balanceOf(address(this)) >= amount, "Insufficient token");
            token.safeTransfer(to, amount);
        }

        emit EmergencyWithdrawn(msg.sender, tokenAddress, to, amount, isNative, block.timestamp);
    }

    /// @notice Update daily limit (admin)
    function setDailyWithdrawalLimit(uint256 newLimit) external onlyAdmin {
        uint256 old = dailyWithdrawalLimit;
        dailyWithdrawalLimit = newLimit;
        emit DailyLimitUpdated(msg.sender, old, newLimit, block.timestamp);
    }

    /// @notice Pause / unpause
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit ContractPaused(msg.sender, block.timestamp);
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit ContractUnpaused(msg.sender, block.timestamp);
    }

    /// @dev Update daily tracking
    function _updateDailyWithdrawal() internal {
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastWithdrawalDay) {
            lastWithdrawalDay = currentDay;
            totalWithdrawnToday = 0;
        }
    }

    /// @notice Get basic request metadata
    function getRequest(bytes32 requestId)
        external
        view
        returns (
            bytes32 id,
            address tokenAddress,
            address to,
            uint256 amount,
            uint256 timestamp,
            bool executed,
            bool isNative,
            address requester,
            uint256 confirmationCount
        )
    {
        WithdrawalRequest storage r = withdrawalRequests[requestId];
        require(r.timestamp != 0, "Invalid request");
        return (r.id, r.tokenAddress, r.to, r.amount, r.timestamp, r.executed, r.isNative, r.requester, r.confirmationCount);
    }

    /// @notice Check whether who has confirmed a given request
    function hasConfirmed(bytes32 requestId, address who) external view returns (bool) {
        return confirmations[requestId][who];
    }

    /// @notice Number of requests created
    function getRequestCount() external view returns (uint256) {
        return withdrawalRequestIds.length;
    }

    /// @notice Get request id at index (useful for off-chain indexing)
    function getRequestIdAt(uint256 index) external view returns (bytes32) {
        require(index < withdrawalRequestIds.length, "Index OOB");
        return withdrawalRequestIds[index];
    }

    /// Allow contract to receive ETH
    receive() external payable {}
}
