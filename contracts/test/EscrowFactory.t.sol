// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {EscrowFactory} from "../src/EscrowFactory.sol";

contract EscrowFactoryTest is Test {
    MockUSDC internal usdc;
    EscrowFactory internal factory;
    address internal owner = makeAddr("owner");
    address internal feeReceiver = makeAddr("feeReceiver");
    address internal client = makeAddr("client");
    address internal freelancer = makeAddr("freelancer");
    address internal arbitrator = makeAddr("arbitrator");

    function setUp() public {
        vm.prank(owner);
        factory = new EscrowFactory(owner, feeReceiver, 100); // 1.00%
        usdc = new MockUSDC();
        vm.prank(owner);
        factory.setTokenAllowed(address(usdc), true);
        vm.prank(owner);
        factory.setArbitrator(arbitrator, true);
    }

    function _amounts() internal pure returns (uint256[] memory a) {
        a = new uint256[](3);
        a[0] = 100e6;
        a[1] = 100e6;
        a[2] = 100e6;
    }

    function _deadlines() internal view returns (uint64[] memory d) {
        d = new uint64[](3);
        d[0] = uint64(block.timestamp + 1 days);
        d[1] = uint64(block.timestamp + 2 days);
        d[2] = uint64(block.timestamp + 3 days);
    }

    function test_constructor_setsFeeAndReceiver() public view {
        assertEq(factory.feeBps(), 100);
        assertEq(factory.feeReceiver(), feeReceiver);
    }

    function test_createEscrow_revertsOnDisallowedToken() public {
        MockUSDC other = new MockUSDC();
        vm.prank(client);
        vm.expectRevert(EscrowFactory.TokenNotAllowed.selector);
        factory.createEscrow(freelancer, address(other), _amounts(), _deadlines());
    }

    function test_createEscrow_revertsOnLengthMismatch() public {
        uint64[] memory d = new uint64[](2);
        d[0] = uint64(block.timestamp + 1 days);
        d[1] = uint64(block.timestamp + 2 days);
        vm.prank(client);
        vm.expectRevert(EscrowFactory.LengthMismatch.selector);
        factory.createEscrow(freelancer, address(usdc), _amounts(), d);
    }

    function test_createEscrow_revertsOnEmpty() public {
        uint256[] memory a = new uint256[](0);
        uint64[] memory d = new uint64[](0);
        vm.prank(client);
        vm.expectRevert(EscrowFactory.EmptyMilestones.selector);
        factory.createEscrow(freelancer, address(usdc), a, d);
    }

    function test_createEscrow_revertsOnZeroAmount() public {
        uint256[] memory a = _amounts();
        a[1] = 0;
        vm.prank(client);
        vm.expectRevert(EscrowFactory.ZeroAmount.selector);
        factory.createEscrow(freelancer, address(usdc), a, _deadlines());
    }

    function test_createEscrow_revertsOnSelfAsFreelancer() public {
        vm.prank(client);
        vm.expectRevert(EscrowFactory.ZeroAddress.selector);
        factory.createEscrow(client, address(usdc), _amounts(), _deadlines());
    }

    function test_createEscrow_indexesByBothParties() public {
        vm.prank(client);
        address esc = factory.createEscrow(freelancer, address(usdc), _amounts(), _deadlines());
        assertEq(factory.allEscrowsCount(), 1);
        assertEq(factory.escrowsOf(client).length, 1);
        assertEq(factory.escrowsOf(freelancer).length, 1);
        assertEq(factory.escrowsOf(client)[0], esc);
    }

    function test_setFee_revertsOverMax() public {
        vm.prank(owner);
        vm.expectRevert(EscrowFactory.FeeTooHigh.selector);
        factory.setFee(201, feeReceiver);
    }

    function test_setTokenAllowed_onlyOwner() public {
        vm.prank(client);
        vm.expectRevert();
        factory.setTokenAllowed(address(usdc), false);
    }

    function test_setArbitrator_onlyOwner() public {
        vm.prank(client);
        vm.expectRevert();
        factory.setArbitrator(arbitrator, false);
    }
}
