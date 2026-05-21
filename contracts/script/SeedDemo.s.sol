// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

/// @notice Mints 1,000 mUSDC to CLIENT_ADDRESS so the demo wallet shows
///         the balance expected by docs/11-mvp-scope.md §demo script.
contract SeedDemo is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address client = vm.envAddress("CLIENT_ADDRESS");
        address usdc = vm.envAddress("MOCK_USDC");
        uint256 amount = vm.envOr("SEED_AMOUNT", uint256(1_000e6));

        vm.startBroadcast(pk);
        MockUSDC(usdc).mint(client, amount);
        vm.stopBroadcast();

        console.log("Minted mUSDC to:", client);
        console.log("Amount (raw):   ", amount);
    }
}
