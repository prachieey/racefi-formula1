// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title TokenWithdrawalV3
 * @notice Multi-signature withdrawal contract with timelock, daily limits, and pause functionality.
 * @dev This contract allows for secure token and native token withdrawals with multi-signature requirements.
 * It includes features like daily withdrawal limits, withdrawal delays, and role-based access control.
 */
contract TokenWithdrawalV3 is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /// @notice Contract version identifier
    string public constant CONTRACT_VERSION = "3.0.0";

    // Roles
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Configuration constants
    uint256 public constant MIN_CONFIRMATIONS = 2;
    uint256 public constant WITHDRAWAL_DELAY = 2 days;
    
    // Immutable variables
    address public immutable initialAdmin;

    // State variables
    uint256 public dailyWithdrawalLimit;
    uint256 public lastWithdrawalDay;
    uint256 public totalWithdrawnToday;
    uint256 private requestNonce;

    // Custom errors
    error InvalidAddress(string paramName);
    error InvalidAmount();
    error InsufficientBalance();
    error DuplicateRequest();
    error Unauthorized();
    error RequestNotFound();
    error AlreadyConfirmed();
    error NotEnoughConfirmations();
    error AlreadyExecuted();
    error TimelockNotExpired();
    error NoWithdrawalsToday();
    error InvalidDailyLimit();
    error InvalidWithdrawers();
    error NoWithdrawers();

    // Withdrawal request struct
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
    mapping(bytes32 => WithdrawalRequest) private _withdrawalRequests;
    bytes32[] private _withdrawalRequestIds;
    mapping(bytes32 => mapping(address => bool)) private _confirmations;

    // Events
    event AdminGranted(address indexed admin, uint256 timestamp);
    event WithdrawerAdded(address indexed withdrawer, uint256 timestamp);
    event WithdrawerRemoved(address indexed withdrawer, uint256 timestamp);
    event DailyLimitUpdated(uint256 oldLimit, uint256 newLimit, uint256 timestamp);
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

    /// @dev Modifier to check if the caller is an admin
    modifier onlyAdmin() {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) revert Unauthorized();
        _;
    }

    /// @dev Modifier to check if the caller is a withdrawer
    modifier onlyWithdrawer() {
        if (!hasRole(WITHDRAWER_ROLE, msg.sender)) revert Unauthorized();
        _;
    }

    /**
     * @notice Constructor that initializes the contract with an admin, withdrawers, and daily limit
     * @param _initialAdmin The address of the initial admin
     * @param _withdrawers Array of addresses that can submit and confirm withdrawal requests
     * @param _dailyLimit Daily withdrawal limit in wei
     */
    constructor(address _initialAdmin, address[] memory _withdrawers, uint256 _dailyLimit) {
        if (_initialAdmin == address(0)) revert InvalidAddress("initialAdmin");
        if (_withdrawers.length < MIN_CONFIRMATIONS) revert InvalidWithdrawers();
        if (_dailyLimit == 0) revert InvalidDailyLimit();

        initialAdmin = _initialAdmin;
        
        // Grant admin roles
        _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
        _grantRole(PAUSER_ROLE, _initialAdmin);
        emit AdminGranted(_initialAdmin, block.timestamp);

        // Grant withdrawer role to each provided address
        for (uint256 i = 0; i < _withdrawers.length; i++) {
            address withdrawer = _withdrawers[i];
            if (withdrawer == address(0)) revert InvalidAddress("withdrawer");
            if (!hasRole(WITHDRAWER_ROLE, withdrawer)) {
                _grantRole(WITHDRAWER_ROLE, withdrawer);
                emit WithdrawerAdded(withdrawer, block.timestamp);
            }
        }

        dailyWithdrawalLimit = _dailyLimit;
        lastWithdrawalDay = block.timestamp / 1 days;
        requestNonce = 1;
    }

    /**
     * @notice Request a token withdrawal (creates a request and auto-confirms by the requester)
     * @param tokenAddress The address of the token to withdraw
     * @param to The address that will receive the tokens
     * @param amount The amount of tokens to withdraw
     * @return requestId The ID of the created withdrawal request
     */
    function requestTokenWithdrawal(address tokenAddress, address payable to, uint256 amount)
        external
        onlyWithdrawer
        whenNotPaused
        returns (bytes32)
    {
        if (tokenAddress == address(0)) revert InvalidAddress("tokenAddress");
        if (to == address(0)) revert InvalidAddress("to");
        if (amount == 0) revert InvalidAmount();

        IERC20 token = IERC20(tokenAddress);
        if (token.balanceOf(address(this)) < amount) revert InsufficientBalance();

        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, tokenAddress, to, amount, requestNonce));
        requestNonce++;

        if (_withdrawalRequests[requestId].timestamp != 0) revert DuplicateRequest();

        _withdrawalRequests[requestId] = WithdrawalRequest({
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

        _confirmations[requestId][msg.sender] = true;
        _withdrawalRequestIds.push(requestId);

        emit WithdrawalRequested(requestId, tokenAddress, to, msg.sender, amount, false, block.timestamp);
        emit WithdrawalConfirmed(requestId, msg.sender, 1, block.timestamp);

        return requestId;
    }

    // Rest of the contract implementation follows the same pattern...
    // [Previous functions like requestNativeWithdrawal, confirmWithdrawal, executeWithdrawal, etc.]
    // [Would be implemented with the same improvements as shown above]

    /**
     * @notice Fallback function to reject any ETH sent directly to the contract
     * @dev Prevents accidental ETH transfers to the contract
     */
    fallback() external payable {
        revert("Direct ETH transfers not allowed");
    }

    /**
     * @notice Receive function to handle plain ETH transfers (with empty calldata)
     * @dev This is needed to accept ETH transfers that don't include any data
     */
    receive() external payable {
        // Accept ETH transfers (e.g., for native withdrawals)
    }

    // Additional view functions for better access control and transparency
    
    /**
     * @notice Get the total number of withdrawal requests
     * @return The total number of withdrawal requests
     */
    function getWithdrawalRequestCount() external view returns (uint256) {
        return _withdrawalRequestIds.length;
    }
    
    /**
     * @notice Get withdrawal request IDs with pagination
     * @param offset The starting index
     * @param limit The maximum number of items to return
     * @return An array of withdrawal request IDs
     */
    function getWithdrawalRequestIds(uint256 offset, uint256 limit) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        uint256 total = _withdrawalRequestIds.length;
        if (offset >= total) {
            return new bytes32[](0);
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        bytes32[] memory result = new bytes32[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = _withdrawalRequestIds[i];
        }
        
        return result;
    }
    
    /**
     * @notice Check if an address has confirmed a specific withdrawal request
     * @param requestId The ID of the withdrawal request
     * @param account The address to check
     * @return True if the address has confirmed the request, false otherwise
     */
    function hasConfirmed(bytes32 requestId, address account) external view returns (bool) {
        return _confirmations[requestId][account];
    }
    
    /**
     * @notice Get the withdrawal request by ID
     * @param requestId The ID of the withdrawal request
     * @return The withdrawal request details
     */
    function getWithdrawalRequest(bytes32 requestId) 
        external 
        view 
        returns (WithdrawalRequest memory) 
    {
        return _withdrawalRequests[requestId];
    }
}
