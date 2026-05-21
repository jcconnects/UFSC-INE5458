// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {EscrowFactory} from "../src/EscrowFactory.sol";
import {Escrow} from "../src/Escrow.sol";

contract EscrowTest is Test {
    MockUSDC internal usdc;
    EscrowFactory internal factory;
    Escrow internal escrow;

    address internal owner = makeAddr("owner");
    address internal feeReceiver = makeAddr("feeReceiver");
    address internal client = makeAddr("client");
    address internal freelancer = makeAddr("freelancer");
    address internal arbitrator = makeAddr("arbitrator");
    address internal stranger = makeAddr("stranger");

    uint256 internal constant M = 100e6;
    uint256 internal constant TOTAL = 300e6;
    uint16 internal constant FEE_BPS = 100; // 1%

    function setUp() public {
        vm.prank(owner);
        factory = new EscrowFactory(owner, feeReceiver, FEE_BPS);
        usdc = new MockUSDC();
        vm.startPrank(owner);
        factory.setTokenAllowed(address(usdc), true);
        factory.setArbitrator(arbitrator, true);
        vm.stopPrank();

        uint256[] memory a = new uint256[](3);
        a[0] = M; a[1] = M; a[2] = M;
        uint64[] memory d = new uint64[](3);
        d[0] = uint64(block.timestamp + 1 days);
        d[1] = uint64(block.timestamp + 2 days);
        d[2] = uint64(block.timestamp + 3 days);

        vm.prank(client);
        escrow = Escrow(factory.createEscrow(freelancer, address(usdc), a, d));

        usdc.mint(client, TOTAL);
    }

    function _depositAll() internal {
        vm.startPrank(client);
        usdc.approve(address(escrow), TOTAL);
        escrow.deposit();
        vm.stopPrank();
    }

    function test_constructor_setsParties() public view {
        assertEq(escrow.client(), client);
        assertEq(escrow.freelancer(), freelancer);
        assertEq(address(escrow.token()), address(usdc));
        assertEq(escrow.milestoneCount(), 3);
    }

    function test_deposit_pullsExactSum_andFlipsAllMilestonesToFunded() public {
        _depositAll();
        assertEq(usdc.balanceOf(address(escrow)), TOTAL);
        assertEq(escrow.depositedBalance(), TOTAL);
        Escrow.Milestone[] memory ms = escrow.getMilestones();
        for (uint256 i = 0; i < 3; i++) {
            assertEq(uint256(ms[i].state), uint256(Escrow.State.Funded));
        }
    }

    function test_deposit_reverts_whenNotClient() public {
        vm.prank(stranger);
        vm.expectRevert(Escrow.NotClient.selector);
        escrow.deposit();
    }

    function test_deposit_reverts_whenAlreadyFunded() public {
        _depositAll();
        vm.prank(client);
        vm.expectRevert(Escrow.AlreadyFunded.selector);
        escrow.deposit();
    }

    function test_submit_reverts_whenNotFreelancer() public {
        _depositAll();
        vm.prank(client);
        vm.expectRevert(Escrow.NotFreelancer.selector);
        escrow.submitMilestone(0, keccak256("hash"));
    }

    function test_submit_reverts_whenMilestoneNotFunded() public {
        // before deposit, state is Created
        vm.prank(freelancer);
        vm.expectRevert(Escrow.BadState.selector);
        escrow.submitMilestone(0, keccak256("hash"));
    }

    function test_approve_reverts_whenNotClient() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("hash"));
        vm.prank(stranger);
        vm.expectRevert(Escrow.NotClient.selector);
        escrow.approveMilestone(0);
    }

    function test_approve_reverts_whenMilestoneNotSubmitted() public {
        _depositAll();
        vm.prank(client);
        vm.expectRevert(Escrow.BadState.selector);
        escrow.approveMilestone(0);
    }

    function test_release_paysFreelancerMinusFee_andSendsFeeToReceiver() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("hash"));
        vm.prank(client);
        escrow.approveMilestone(0);
        vm.prank(client);
        escrow.releasePayment(0);

        uint256 fee = (M * FEE_BPS) / 10_000;
        assertEq(usdc.balanceOf(freelancer), M - fee);
        assertEq(usdc.balanceOf(feeReceiver), fee);
        assertEq(escrow.depositedBalance(), TOTAL - M);
    }

    function test_release_reverts_whenMilestoneNotApproved() public {
        _depositAll();
        vm.prank(client);
        vm.expectRevert(Escrow.BadState.selector);
        escrow.releasePayment(0);
    }

    function test_release_callableByFreelancer() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("hash"));
        vm.prank(client);
        escrow.approveMilestone(0);
        vm.prank(freelancer);
        escrow.releasePayment(0);
        assertEq(usdc.balanceOf(freelancer), M - (M * FEE_BPS) / 10_000);
    }

    function test_happyPath_threeMilestones_releaseEach() public {
        _depositAll();
        bytes32 h = keccak256("deliverable");

        for (uint256 i = 0; i < 3; i++) {
            vm.prank(freelancer);
            escrow.submitMilestone(i, h);
            vm.prank(client);
            escrow.approveMilestone(i);
            vm.prank(client);
            escrow.releasePayment(i);
        }

        uint256 fee = (M * FEE_BPS) / 10_000;
        assertEq(usdc.balanceOf(freelancer), 3 * (M - fee));
        assertEq(usdc.balanceOf(feeReceiver), 3 * fee);
        assertEq(escrow.depositedBalance(), 0);
        assertEq(uint256(escrow.status()), uint256(Escrow.EscrowStatus.Closed));
    }

    function test_requestChanges_returnsToFunded() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("h1"));
        vm.prank(client);
        escrow.requestChanges(0);
        Escrow.Milestone memory m = escrow.getMilestone(0);
        assertEq(uint256(m.state), uint256(Escrow.State.Funded));
        assertEq(m.deliverableHash, bytes32(0));

        // freelancer can resubmit
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("h2"));
    }

    function test_refund_afterDeadline_returnsFundsToClient() public {
        _depositAll();
        // deadline of milestone 0 is +1 day
        vm.warp(block.timestamp + 2 days);
        vm.prank(client);
        escrow.refund(0);
        assertEq(usdc.balanceOf(client), M);
        assertEq(escrow.depositedBalance(), TOTAL - M);
    }

    function test_refund_reverts_beforeDeadline() public {
        _depositAll();
        vm.prank(client);
        vm.expectRevert(Escrow.DeadlineNotPassed.selector);
        escrow.refund(0);
    }

    function test_openDispute_locksMilestone() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("h"));
        vm.prank(client);
        escrow.openDispute(0);
        Escrow.Milestone memory m = escrow.getMilestone(0);
        assertEq(uint256(m.state), uint256(Escrow.State.Disputed));
    }

    function test_resolveDispute_pay() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("h"));
        vm.prank(client);
        escrow.openDispute(0);

        vm.prank(arbitrator);
        escrow.resolveDispute(0, Escrow.Verdict.Pay, 0);
        assertEq(usdc.balanceOf(freelancer), M);
        assertEq(escrow.depositedBalance(), TOTAL - M);
    }

    function test_resolveDispute_refund() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("h"));
        vm.prank(client);
        escrow.openDispute(0);

        vm.prank(arbitrator);
        escrow.resolveDispute(0, Escrow.Verdict.Refund, 0);
        assertEq(usdc.balanceOf(client), M);
    }

    function test_resolveDispute_split() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("h"));
        vm.prank(client);
        escrow.openDispute(0);

        vm.prank(arbitrator);
        escrow.resolveDispute(0, Escrow.Verdict.Split, 6000); // 60/40

        assertEq(usdc.balanceOf(freelancer), (M * 6000) / 10_000);
        assertEq(usdc.balanceOf(client), M - (M * 6000) / 10_000);
    }

    function test_arbitrator_onlyAllowedArbitratorCanResolve() public {
        _depositAll();
        vm.prank(freelancer);
        escrow.submitMilestone(0, keccak256("h"));
        vm.prank(client);
        escrow.openDispute(0);
        vm.prank(stranger);
        vm.expectRevert(Escrow.NotArbitrator.selector);
        escrow.resolveDispute(0, Escrow.Verdict.Pay, 0);
    }

    function test_cancelBeforeFunding() public {
        vm.prank(client);
        escrow.cancelBeforeFunding();
        assertEq(uint256(escrow.status()), uint256(Escrow.EscrowStatus.Closed));
    }

    function test_cancelBeforeFunding_reverts_afterDeposit() public {
        _depositAll();
        vm.prank(client);
        vm.expectRevert(Escrow.BadState.selector);
        escrow.cancelBeforeFunding();
    }
}
