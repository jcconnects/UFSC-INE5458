// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IEscrowFactory {
    function feeBps() external view returns (uint16);
    function feeReceiver() external view returns (address);
    function arbitratorAllowed(address) external view returns (bool);
}

/// @title TrustPay Escrow instance
/// @notice Holds locked stablecoin for one client/freelancer agreement.
///         Funds are released only on milestone approval, refunded after a
///         missed deadline, or executed by arbitrator verdict on dispute.
contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error NotClient();
    error NotFreelancer();
    error NotParty();
    error NotArbitrator();
    error BadMilestone();
    error BadState();
    error AlreadyFunded();
    error DeadlineNotPassed();
    error BadSplit();

    enum State {
        Created,
        Funded,
        Submitted,
        Approved,
        Released,
        Disputed,
        Resolved,
        Refunded
    }

    enum EscrowStatus {
        AwaitingDeposit,
        Active,
        Closed
    }

    enum Verdict {
        Pay,
        Refund,
        Split
    }

    struct Milestone {
        uint256 amount;
        uint64 deadline;
        State state;
        bytes32 deliverableHash;
    }

    address public immutable factory;
    address public immutable client;
    address public immutable freelancer;
    IERC20 public immutable token;

    Milestone[] private _milestones;
    uint256 public depositedBalance;
    EscrowStatus public status;

    event FundDeposited(address indexed client, uint256 amount);
    event MilestoneSubmitted(uint256 indexed id, bytes32 hash);
    event MilestoneApproved(uint256 indexed id);
    event PaymentReleased(uint256 indexed id, uint256 toFreelancer, uint256 fee);
    event ChangesRequested(uint256 indexed id);
    event DisputeOpened(uint256 indexed id, address indexed by);
    event DisputeResolved(uint256 indexed id, Verdict verdict, uint16 freelancerBps);
    event RefundIssued(uint256 indexed id, uint256 amount);
    event Cancelled();

    constructor(
        address _factory,
        address _client,
        address _freelancer,
        address _token,
        uint256[] memory amounts,
        uint64[] memory deadlines
    ) {
        factory = _factory;
        client = _client;
        freelancer = _freelancer;
        token = IERC20(_token);

        uint256 n = amounts.length;
        for (uint256 i = 0; i < n; i++) {
            _milestones.push(
                Milestone({
                    amount: amounts[i],
                    deadline: deadlines[i],
                    state: State.Created,
                    deliverableHash: bytes32(0)
                })
            );
        }
        status = EscrowStatus.AwaitingDeposit;
    }

    modifier onlyClient() {
        if (msg.sender != client) revert NotClient();
        _;
    }

    modifier onlyFreelancer() {
        if (msg.sender != freelancer) revert NotFreelancer();
        _;
    }

    modifier onlyParty() {
        if (msg.sender != client && msg.sender != freelancer) revert NotParty();
        _;
    }

    function milestoneCount() external view returns (uint256) {
        return _milestones.length;
    }

    function getMilestones() external view returns (Milestone[] memory) {
        return _milestones;
    }

    function getMilestone(uint256 id) external view returns (Milestone memory) {
        if (id >= _milestones.length) revert BadMilestone();
        return _milestones[id];
    }

    function summary()
        external
        view
        returns (
            address _client,
            address _freelancer,
            address _token,
            uint256 _deposited,
            EscrowStatus _status,
            uint256 _milestoneCount
        )
    {
        return (client, freelancer, address(token), depositedBalance, status, _milestones.length);
    }

    function deposit() external nonReentrant onlyClient {
        if (status != EscrowStatus.AwaitingDeposit) revert AlreadyFunded();
        uint256 total;
        uint256 n = _milestones.length;
        for (uint256 i = 0; i < n; i++) {
            total += _milestones[i].amount;
            _milestones[i].state = State.Funded;
        }
        depositedBalance = total;
        status = EscrowStatus.Active;
        token.safeTransferFrom(msg.sender, address(this), total);
        emit FundDeposited(msg.sender, total);
    }

    function submitMilestone(uint256 id, bytes32 hash) external onlyFreelancer {
        if (id >= _milestones.length) revert BadMilestone();
        Milestone storage m = _milestones[id];
        if (m.state != State.Funded) revert BadState();
        m.state = State.Submitted;
        m.deliverableHash = hash;
        emit MilestoneSubmitted(id, hash);
    }

    function approveMilestone(uint256 id) external onlyClient {
        if (id >= _milestones.length) revert BadMilestone();
        Milestone storage m = _milestones[id];
        if (m.state != State.Submitted) revert BadState();
        m.state = State.Approved;
        emit MilestoneApproved(id);
    }

    function requestChanges(uint256 id) external onlyClient {
        if (id >= _milestones.length) revert BadMilestone();
        Milestone storage m = _milestones[id];
        if (m.state != State.Submitted) revert BadState();
        m.state = State.Funded;
        m.deliverableHash = bytes32(0);
        emit ChangesRequested(id);
    }

    function releasePayment(uint256 id) external nonReentrant onlyParty {
        if (id >= _milestones.length) revert BadMilestone();
        Milestone storage m = _milestones[id];
        if (m.state != State.Approved) revert BadState();

        uint256 amount = m.amount;
        uint16 bps = IEscrowFactory(factory).feeBps();
        address feeTo = IEscrowFactory(factory).feeReceiver();
        uint256 fee = (amount * bps) / 10_000;
        uint256 net = amount - fee;

        m.state = State.Released;
        depositedBalance -= amount;
        _maybeClose();

        if (fee > 0) token.safeTransfer(feeTo, fee);
        token.safeTransfer(freelancer, net);
        emit PaymentReleased(id, net, fee);
    }

    function refund(uint256 id) external nonReentrant onlyClient {
        if (id >= _milestones.length) revert BadMilestone();
        Milestone storage m = _milestones[id];
        if (m.state != State.Funded) revert BadState();
        if (block.timestamp <= m.deadline) revert DeadlineNotPassed();

        uint256 amount = m.amount;
        m.state = State.Refunded;
        depositedBalance -= amount;
        _maybeClose();

        token.safeTransfer(client, amount);
        emit RefundIssued(id, amount);
    }

    function openDispute(uint256 id) external onlyParty {
        if (id >= _milestones.length) revert BadMilestone();
        Milestone storage m = _milestones[id];
        if (m.state != State.Funded && m.state != State.Submitted) revert BadState();
        m.state = State.Disputed;
        emit DisputeOpened(id, msg.sender);
    }

    /// @notice Arbitrator-only. `freelancerBps` only used for Split (0..10000).
    function resolveDispute(uint256 id, Verdict v, uint16 freelancerBps) external nonReentrant {
        if (!IEscrowFactory(factory).arbitratorAllowed(msg.sender)) revert NotArbitrator();
        if (id >= _milestones.length) revert BadMilestone();
        Milestone storage m = _milestones[id];
        if (m.state != State.Disputed) revert BadState();

        uint256 amount = m.amount;
        m.state = State.Resolved;
        depositedBalance -= amount;
        _maybeClose();

        if (v == Verdict.Pay) {
            token.safeTransfer(freelancer, amount);
        } else if (v == Verdict.Refund) {
            token.safeTransfer(client, amount);
        } else {
            if (freelancerBps > 10_000) revert BadSplit();
            uint256 toFreelancer = (amount * freelancerBps) / 10_000;
            uint256 toClient = amount - toFreelancer;
            if (toFreelancer > 0) token.safeTransfer(freelancer, toFreelancer);
            if (toClient > 0) token.safeTransfer(client, toClient);
        }

        emit DisputeResolved(id, v, freelancerBps);
    }

    function cancelBeforeFunding() external onlyClient {
        if (status != EscrowStatus.AwaitingDeposit) revert BadState();
        status = EscrowStatus.Closed;
        emit Cancelled();
    }

    function _maybeClose() internal {
        if (depositedBalance == 0) {
            status = EscrowStatus.Closed;
        }
    }
}
