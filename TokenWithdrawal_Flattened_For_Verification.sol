// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

// File: @openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/IERC20Permit.sol)

interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
    function nonces(address owner) external view returns (uint256);
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

// File: @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol
// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)

library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(token.transfer.selector, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SafeERC20: ERC20 operation did not succeed");
    }
    
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SafeERC20: ERC20 operation did not succeed");
    }
    
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(token.approve.selector, spender, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SafeERC20: ERC20 operation did not succeed");
    }
}

// File: @openzeppelin/contracts/utils/Context.sol
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File: @openzeppelin/contracts/access/IAccessControl.sol
// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)

interface IAccessControl {
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    function hasRole(bytes32 role, address account) external view returns (bool);
    function getRoleAdmin(bytes32 role) external view returns (bytes32);
    function grantRole(bytes32 role, address account) external;
    function revokeRole(bytes32 role, address account) external;
    function renounceRole(bytes32 role, address account) external;
}

// File: @openzeppelin/contracts/access/AccessControl.sol
// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)

abstract contract AccessControl is Context, IAccessControl {
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        return _roles[role].members[account];
    }

    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert("AccessControl: account is missing role");
        }
    }

    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
        return _roles[role].adminRole;
    }

    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    function renounceRole(bytes32 role, address account) public virtual override {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
        _revokeRole(role, account);
    }

    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }
}

// File: @openzeppelin/contracts/security/ReentrancyGuard.sol
// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// File: @openzeppelin/contracts/security/Pausable.sol
// OpenZeppelin Contracts (last updated v4.9.0) (security/Pausable.sol)

abstract contract Pausable is Context {
    event Paused(address account);
    event Unpaused(address account);
    bool private _paused;

    constructor() {
        _paused = false;
    }

    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    modifier whenPaused() {
        _requirePaused();
        _;
    }

    function paused() public view virtual returns (bool) {
        return _paused;
    }

    function _requireNotPaused() internal view virtual {
        require(!paused(), "Pausable: paused");
    }

    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
    }

    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

// File: contracts/TokenWithdrawal.sol

/// @title TokenWithdrawal (improved/fixed)
/// @notice Multi-sig withdrawer contract with timelock, daily limits, pause, and safe token handling.
contract TokenWithdrawal is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Minimum confirmations and timelock
    uint256 public constant MIN_CONFIRMATIONS = 2;
    uint256 public constant WITHDRAWAL_DELAY = 2 days;

    // Daily limit (NOTE: single limit applies to amounts as raw uint256.
    // If you want different limits per token, extend mapping token -> limit)
    uint256 public dailyWithdrawalLimit;
    
    // Track daily withdrawals
    mapping(uint256 => uint256) public dailyWithdrawals; // timestamp => amount
    
    // Withdrawal request
    struct WithdrawalRequest {
        address tokenAddress;
        address to;
        uint256 amount;
        bool isNative;
        uint256 timestamp;
        bool executed;
        uint256 confirmations;
    }
    
    // Track requests and confirmations
    mapping(bytes32 => WithdrawalRequest) public withdrawalRequests;
    mapping(bytes32 => mapping(address => bool)) public confirmations;
    
    // Nonce for unique request IDs
    uint256 public nonce;
    
    // Events
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
    event ContractUnpaused(address indexed unpauser, uint256 timestamp);
    
    // Modifiers
    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not admin");
        _;
    }
    
    modifier onlyWithdrawer() {
        require(hasRole(WITHDRAWER_ROLE, msg.sender), "Caller is not a withdrawer");
        _;
    }
    
    modifier onlyPauser() {
        require(hasRole(PAUSER_ROLE, msg.sender), "Caller is not a pauser");
        _;
    }
    
    constructor(address admin, uint256 _dailyWithdrawalLimit) {
        require(admin != address(0), "Invalid admin address");
        
        // Set up roles
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(WITHDRAWER_ROLE, admin);
        _setupRole(PAUSER_ROLE, admin);
        
        // Set daily withdrawal limit
        dailyWithdrawalLimit = _dailyWithdrawalLimit;
        
        // Set up role admin
        _setRoleAdmin(WITHDRAWER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(PAUSER_ROLE, DEFAULT_ADMIN_ROLE);
    }
    
    // Request a withdrawal (can be called by anyone, but requires confirmations to execute)
    function requestWithdrawal(
        address tokenAddress,
        address to,
        uint256 amount,
        bool isNative
    ) external whenNotPaused returns (bytes32) {
        require(tokenAddress != address(0), "Invalid token");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        
        // Generate unique request ID
        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce++));
        
        // Create new withdrawal request
        withdrawalRequests[requestId] = WithdrawalRequest({
            tokenAddress: tokenAddress,
            to: to,
            amount: amount,
            isNative: isNative,
            timestamp: block.timestamp,
            executed: false,
            confirmations: 0
        });
        
        // Auto-confirm by the requester if they are a withdrawer
        if (hasRole(WITHDRAWER_ROLE, msg.sender)) {
            _confirmWithdrawal(requestId);
        }
        
        emit WithdrawalRequested(
            requestId,
            tokenAddress,
            to,
            msg.sender,
            amount,
            isNative,
            block.timestamp
        );
        
        return requestId;
    }
    
    // Confirm a withdrawal (can be called by any withdrawer)
    function confirmWithdrawal(bytes32 requestId) external onlyWithdrawer whenNotPaused {
        _confirmWithdrawal(requestId);
    }
    
    function _confirmWithdrawal(bytes32 requestId) internal {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        require(request.amount > 0, "Invalid request");
        require(!request.executed, "Already executed");
        require(!confirmations[requestId][msg.sender], "Already confirmed");
        
        // Mark as confirmed by this address
        confirmations[requestId][msg.sender] = true;
        request.confirmations++;
        
        emit WithdrawalConfirmed(
            requestId,
            msg.sender,
            request.confirmations,
            block.timestamp
        );
    }
    
    // Execute a withdrawal (can be called by any withdrawer after enough confirmations and delay)
    function executeWithdrawal(bytes32 requestId) external nonReentrant whenNotPaused {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        require(request.amount > 0, "Invalid request");
        require(!request.executed, "Already executed");
        require(hasRole(WITHDRAWER_ROLE, msg.sender), "Not authorized");
        require(
            block.timestamp >= request.timestamp + WITHDRAWAL_DELAY,
            "Withdrawal delay not passed"
        );
        require(
            request.confirmations >= MIN_CONFIRMATIONS,
            "Insufficient confirmations"
        );
        
        // Mark as executed
        request.executed = true;
        
        // Update daily withdrawal amount
        uint256 day = block.timestamp / 1 days;
        dailyWithdrawals[day] += request.amount;
        
        // Check daily limit
        require(
            dailyWithdrawals[day] <= dailyWithdrawalLimit,
            "Daily withdrawal limit exceeded"
        );
        
        // Execute the transfer
        if (request.isNative) {
            // For native token (ETH/BNB/MATIC)
            (bool success, ) = request.to.call{value: request.amount}("");
            require(success, "Transfer failed");
        } else {
            // For ERC20 tokens
            IERC20 token = IERC20(request.tokenAddress);
            token.safeTransfer(request.to, request.amount);
        }
        
        emit WithdrawalExecuted(
            requestId,
            request.tokenAddress,
            request.to,
            msg.sender,
            request.amount,
            request.isNative,
            block.timestamp
        );
    }
    
    // Admin functions
    function setDailyWithdrawalLimit(uint256 newLimit) external onlyAdmin {
        require(newLimit > 0, "Limit must be > 0");
        uint256 oldLimit = dailyWithdrawalLimit;
        dailyWithdrawalLimit = newLimit;
        
        emit DailyLimitUpdated(msg.sender, oldLimit, newLimit, block.timestamp);
    }
    
    function recoverToken(address tokenAddress, uint256 tokenAmount) external onlyAdmin {
        require(tokenAddress != address(0), "Invalid token");
        require(tokenAmount > 0, "Amount must be > 0");
        
        IERC20(tokenAddress).safeTransfer(msg.sender, tokenAmount);
        
        emit TokenRecovered(tokenAddress, msg.sender, tokenAmount, block.timestamp);
    }
    
    function emergencyWithdraw(
        address tokenAddress,
        address to,
        uint256 amount,
        bool isNative
    ) external onlyAdmin {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        
        if (isNative) {
            (bool success, ) = to.call{value: amount}("");
            require(success, "Transfer failed");
        } else {
            require(tokenAddress != address(0), "Invalid token");
            IERC20(tokenAddress).safeTransfer(to, amount);
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
    
    // Pausable functions
    function pause() external onlyPauser {
        _pause();
        emit ContractPaused(msg.sender, block.timestamp);
    }
    
    function unpause() external onlyPauser {
        _unpause();
        emit ContractUnpaused(msg.sender, block.timestamp);
    }
    
    // Receive function to accept native token
    receive() external payable {}
    
    // View functions
    function getRequest(bytes32 requestId) external view returns (
        address tokenAddress,
        address to,
        uint256 amount,
        bool isNative,
        uint256 timestamp,
        bool executed,
        uint256 confirmationsCount
    ) {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        return (
            request.tokenAddress,
            request.to,
            request.amount,
            request.isNative,
            request.timestamp,
            request.executed,
            request.confirmations
        );
    }
    
    function hasConfirmed(bytes32 requestId, address account) external view returns (bool) {
        return confirmations[requestId][account];
    }
    
    function getDailyWithdrawal(uint256 day) external view returns (uint256) {
        return dailyWithdrawals[day];
    }
}
