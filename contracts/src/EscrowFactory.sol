// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Escrow} from "./Escrow.sol";

/// @title TrustPay Escrow factory
/// @notice Deploys per-agreement Escrow instances. Holds platform-wide
///         allowlist (tokens, arbitrators), fee config, and a simple per-user
///         index so the UI can list "my escrows" without an off-chain indexer.
/// @dev    The factory **never** touches funds inside a deployed Escrow.
///         No factory function takes an escrow address as a parameter.
contract EscrowFactory is Ownable {
    error TokenNotAllowed();
    error LengthMismatch();
    error EmptyMilestones();
    error ZeroAmount();
    error FeeTooHigh();
    error ZeroAddress();

    uint16 public constant MAX_FEE_BPS = 200; // 2.00%

    uint16 public feeBps;
    address public feeReceiver;

    mapping(address => bool) public tokenAllowed;
    mapping(address => bool) public arbitratorAllowed;

    address[] public allEscrows;
    mapping(address => address[]) private _escrowsOf;

    event EscrowCreated(
        address indexed escrow,
        address indexed client,
        address indexed freelancer,
        address token,
        uint256 totalAmount
    );
    event TokenAllowedSet(address indexed token, bool allowed);
    event ArbitratorSet(address indexed arbitrator, bool allowed);
    event FeeSet(uint16 feeBps, address feeReceiver);

    constructor(address initialOwner, address _feeReceiver, uint16 _feeBps) Ownable(initialOwner) {
        if (_feeReceiver == address(0)) revert ZeroAddress();
        if (_feeBps > MAX_FEE_BPS) revert FeeTooHigh();
        feeReceiver = _feeReceiver;
        feeBps = _feeBps;
        emit FeeSet(_feeBps, _feeReceiver);
    }

    function setTokenAllowed(address token, bool allowed) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        tokenAllowed[token] = allowed;
        emit TokenAllowedSet(token, allowed);
    }

    function setArbitrator(address arbitrator, bool allowed) external onlyOwner {
        if (arbitrator == address(0)) revert ZeroAddress();
        arbitratorAllowed[arbitrator] = allowed;
        emit ArbitratorSet(arbitrator, allowed);
    }

    function setFee(uint16 _feeBps, address _feeReceiver) external onlyOwner {
        if (_feeBps > MAX_FEE_BPS) revert FeeTooHigh();
        if (_feeReceiver == address(0)) revert ZeroAddress();
        feeBps = _feeBps;
        feeReceiver = _feeReceiver;
        emit FeeSet(_feeBps, _feeReceiver);
    }

    function createEscrow(
        address freelancer,
        address token,
        uint256[] calldata amounts,
        uint64[] calldata deadlines
    ) external returns (address escrow) {
        if (!tokenAllowed[token]) revert TokenNotAllowed();
        if (freelancer == address(0) || freelancer == msg.sender) revert ZeroAddress();
        uint256 n = amounts.length;
        if (n == 0) revert EmptyMilestones();
        if (n != deadlines.length) revert LengthMismatch();

        uint256 total;
        for (uint256 i = 0; i < n; i++) {
            if (amounts[i] == 0) revert ZeroAmount();
            total += amounts[i];
        }

        Escrow e = new Escrow(address(this), msg.sender, freelancer, token, amounts, deadlines);
        escrow = address(e);

        allEscrows.push(escrow);
        _escrowsOf[msg.sender].push(escrow);
        _escrowsOf[freelancer].push(escrow);

        emit EscrowCreated(escrow, msg.sender, freelancer, token, total);
    }

    function escrowsOf(address user) external view returns (address[] memory) {
        return _escrowsOf[user];
    }

    function escrowsOfCount(address user) external view returns (uint256) {
        return _escrowsOf[user].length;
    }

    function allEscrowsCount() external view returns (uint256) {
        return allEscrows.length;
    }
}
