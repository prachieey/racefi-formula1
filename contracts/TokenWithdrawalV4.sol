// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TokenWithdrawalV4
 * @notice Enhanced multi-sig withdrawer contract with timelock, daily limits, pause, and security features
 * @dev Includes all V3 features plus:
 * - Timelock for admin role transfers
 * - Batch operations
 * - Circuit breakers
 * - Maximum limits
 * - Enhanced error handling
 */
contract TokenWithdrawalV4 is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /*///////////////////////////////////////////////////////////////
                               CONSTANTS
    //////////////////////////////////////////////////////////////*/
    uint256 public constant MIN_CONFIRMATIONS = 2;
    uint256 public constant WITHDRAWAL_DELAY = 2 days;
    uint256 public constant ROLE_TRANSFER_DELAY = 1 days;
    uint256 public constant MAX_WITHDRAWAL_AMOUNT = 1000000 * 10**18; // 1M tokens
    string public constant CONTRACT_VERSION = "4.0.0";

    /*///////////////////////////////////////////////////////////////
                                ROLES
    //////////////////////////////////////////////////////////////*/
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    /*///////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error NotAdmin();
    error NotWithdrawer();
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance();
    error RequestNotFound();
    error AlreadyExecuted();
    error AlreadyConfirmed();
    error TimelockNotExpired();
    error InsufficientConfirmations();
    error DailyLimitExceeded();
    error PendingActionExists();
    error PendingActionNotReady();
    error MaxWithdrawalExceeded();
    error FunctionPaused(bytes4 functionSig);
    error InvalidRoleTransfer();
    error NoPendingRoleTransfer();

    /*///////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/
    // [Previous events remain the same...]
    event WithdrawalRequested(
        bytes32 indexed requestId,
        address indexed tokenAddress,
        address indexed to,
        address requester,
        uint256 amount,
        bool isNative,
        uint256 timestamp
    );
    
    event RoleTransferProposed(
        bytes32 indexed role,
        address indexed currentHolder,
        address indexed newHolder,
        uint256 executeAfter
    );
    
    event RoleTransferCancelled(
        bytes32 indexed role,
        address indexed currentHolder,
        address indexed newHolder
    );
    
    event FunctionPauseToggled(
        bytes4 functionSig,
        bool paused,
        address indexed admin
    );

    /*///////////////////////////////////////////////////////////////
                             STORAGE (PRIVATE)
    //////////////////////////////////////////////////////////////*/
    uint256 private dailyWithdrawalLimit;
    uint256 private lastWithdrawalDay;
    uint256 private totalWithdrawnToday;
    address public immutable initialAdmin;
    uint256 private requestNonce;

    // Circuit breakers
    mapping(bytes4 => bool) public functionPaused;
    
    // Role transfer timelock
    struct RoleTransfer {
        bytes32 role;
        address currentHolder;
        address newHolder;
        uint256 executeAfter;
    }
    mapping(bytes32 => RoleTransfer) public pendingRoleTransfers;

    // [Previous structs and mappings remain the same...]
    struct WithdrawalRequest {
        bytes32 id;
        address tokenAddress;
        address payable to;
        uint256 amount;
        uint256 timestamp;
        bool executed;
        bool isNative;
        address requester;
        uint256 confirmationCount;
    }

    mapping(bytes32 => WithdrawalRequest) private withdrawalRequests;
    bytes32[] private withdrawalRequestIds;
    mapping(bytes32 => mapping(address => bool)) private confirmations;
    
    struct PendingLimit {
        uint256 newLimit;
        uint256 executeAfter;
        bool exists;
    }
    PendingLimit private pendingLimitChange;

    /*///////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier onlyAdmin() {
        _checkRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _;
    }

    modifier onlyWithdrawer() {
        _checkRole(WITHDRAWER_ROLE, msg.sender);
        _;
    }
    
    modifier whenFunctionNotPaused(bytes4 functionSig) {
        if (functionPaused[functionSig]) revert FunctionPaused(functionSig);
        _;
    }
    
    modifier validateWithdrawalAmount(uint256 amount) {
        if (amount == 0) revert ZeroAmount();
        if (amount > MAX_WITHDRAWAL_AMOUNT) revert MaxWithdrawalExceeded();
        _;
    }

    /*///////////////////////////////////////////////////////////////
                         NEW FUNCTIONALITY
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Propose a role transfer with a timelock
     * @param role The role to transfer
     * @param newHolder The address to transfer the role to
     */
    function proposeRoleTransfer(bytes32 role, address newHolder) external onlyAdmin {
        if (newHolder == address(0)) revert ZeroAddress();
        
        bytes32 transferId = keccak256(abi.encode(role, msg.sender, newHolder));
        if (pendingRoleTransfers[transferId].executeAfter != 0) revert PendingActionExists();
        
        pendingRoleTransfers[transferId] = RoleTransfer({
            role: role,
            currentHolder: msg.sender,
            newHolder: newHolder,
            executeAfter: block.timestamp + ROLE_TRANSFER_DELAY
        });
        
        emit RoleTransferProposed(role, msg.sender, newHolder, block.timestamp + ROLE_TRANSFER_DELAY);
    }
    
    /**
     * @notice Execute a proposed role transfer after timelock
     * @param role The role to transfer
     * @param currentHolder The current role holder
     */
    function executeRoleTransfer(bytes32 role, address currentHolder) external nonReentrant {
        bytes32 transferId = keccak256(abi.encode(role, currentHolder, msg.sender));
        RoleTransfer storage transfer = pendingRoleTransfers[transferId];
        
        if (transfer.executeAfter == 0) revert NoPendingRoleTransfer();
        if (block.timestamp < transfer.executeAfter) revert TimelockNotExpired();
        if (!hasRole(role, currentHolder)) revert InvalidRoleTransfer();
        
        _grantRole(role, msg.sender);
        _revokeRole(role, currentHolder);
        
        delete pendingRoleTransfers[transferId];
        
        emit RoleTransferred(role, currentHolder, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Cancel a proposed role transfer
     * @param role The role of the transfer to cancel
     * @param newHolder The proposed new holder of the role
     */
    function cancelRoleTransfer(bytes32 role, address newHolder) external onlyAdmin {
        bytes32 transferId = keccak256(abi.encode(role, msg.sender, newHolder));
        if (pendingRoleTransfers[transferId].executeAfter == 0) revert NoPendingRoleTransfer();
        
        delete pendingRoleTransfers[transferId];
        
        emit RoleTransferCancelled(role, msg.sender, newHolder);
    }
    
    /**
     * @notice Toggle pause state for a specific function
     * @param functionSig The function signature to pause/unpause
     * @param paused Whether to pause or unpause the function
     */
    function toggleFunctionPause(bytes4 functionSig, bool paused) external onlyRole(EMERGENCY_ROLE) {
        functionPaused[functionSig] = paused;
        emit FunctionPauseToggled(functionSig, paused, msg.sender);
    }
    
    /**
     * @notice Batch confirm multiple withdrawal requests
     * @param requestIds Array of request IDs to confirm
     */
    function batchConfirm(bytes32[] calldata requestIds) 
        external 
        onlyWithdrawer 
        whenNotPaused 
        whenFunctionNotPaused(this.batchConfirm.selector) 
    {
        for (uint256 i = 0; i < requestIds.length; i++) {
            bytes32 requestId = requestIds[i];
            if (confirmations[requestId][msg.sender]) continue;
            
            WithdrawalRequest storage r = withdrawalRequests[requestId];
            if (r.timestamp == 0) revert RequestNotFound();
            if (r.executed) revert AlreadyExecuted();
            
            confirmations[requestId][msg.sender] = true;
            r.confirmationCount++;
            
            emit WithdrawalConfirmed(requestId, msg.sender, r.confirmationCount, block.timestamp);
        }
    }
    
    /*///////////////////////////////////////////////////////////////
                         MODIFIED FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    // Modified requestTokenWithdrawal with amount validation
    function requestTokenWithdrawal(
        address tokenAddress, 
        address payable to, 
        uint256 amount
    ) 
        external 
        onlyWithdrawer 
        whenNotPaused 
        whenFunctionNotPaused(this.requestTokenWithdrawal.selector)
        validateWithdrawalAmount(amount)
        returns (bytes32) 
    {
        if (tokenAddress == address(0)) revert ZeroAddress();
        if (to == address(0)) revert ZeroAddress();

        IERC20 token = IERC20(tokenAddress);
        if (token.balanceOf(address(this)) < amount) revert InsufficientBalance();

        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, tokenAddress, to, amount, requestNonce));
        requestNonce++;

        if (withdrawalRequests[requestId].timestamp != 0) revert PendingActionExists();

        withdrawalRequests[requestId] = WithdrawalRequest({
            id: requestId,
            tokenAddress: tokenAddress,
            to: to,
            amount: amount,
            timestamp: block.timestamp,
            executed: false,
            isNative: false,
            requester: msg.sender,
            confirmationCount: 1
        });

        confirmations[requestId][msg.sender] = true;
        withdrawalRequestIds.push(requestId);

        emit WithdrawalRequested(requestId, tokenAddress, to, msg.sender, amount, false, block.timestamp);
        emit WithdrawalConfirmed(requestId, msg.sender, 1, block.timestamp);

        return requestId;
    }
    
    // [Other modified functions follow the same pattern...]
    
    /*///////////////////////////////////////////////////////////////
                         VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Check if a role transfer is pending
     * @param role The role to check
     * @param currentHolder The current role holder
     * @param newHolder The proposed new holder
     * @return exists Whether the transfer is pending
     * @return executeAfter When the transfer can be executed
     */
    function getPendingRoleTransfer(
        bytes32 role, 
        address currentHolder, 
        address newHolder
    ) external view returns (bool exists, uint256 executeAfter) {
        bytes32 transferId = keccak256(abi.encode(role, currentHolder, newHolder));
        RoleTransfer memory transfer = pendingRoleTransfers[transferId];
        return (transfer.executeAfter > 0, transfer.executeAfter);
    }
    
    /**
     * @notice Check if a function is paused
     * @param functionSig The function signature to check
     * @return Whether the function is paused
     */
    function isFunctionPaused(bytes4 functionSig) external view returns (bool) {
        return functionPaused[functionSig];
    }
    
    // [Rest of the contract remains the same...]
    
    /*///////////////////////////////////////////////////////////////
                              RECEIVE / FALLBACK
    //////////////////////////////////////////////////////////////*/
    receive() external payable {}

    fallback() external payable {
        revert("Invalid call");
    }
}
