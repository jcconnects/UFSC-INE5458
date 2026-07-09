// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {EscrowFactory} from "../src/EscrowFactory.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);

        vm.startBroadcast(pk);

        MockUSDC usdc = new MockUSDC();
        EscrowFactory factory = new EscrowFactory(deployer, deployer, 0); // 0% fee for the demo: release pays the milestone amount exactly
        factory.setTokenAllowed(address(usdc), true);
        factory.setArbitrator(deployer, true);

        vm.stopBroadcast();

        console.log("Chain ID:        ", block.chainid);
        console.log("Deployer:        ", deployer);
        console.log("MockUSDC:        ", address(usdc));
        console.log("EscrowFactory:   ", address(factory));
        console.log("Fee receiver:    ", deployer);
        console.log("Arbitrator:      ", deployer);

        string memory json = string.concat(
            '{\n  "chainId": ', vm.toString(block.chainid),
            ',\n  "deployer": "', vm.toString(deployer),
            '",\n  "mockUSDC": "', vm.toString(address(usdc)),
            '",\n  "escrowFactory": "', vm.toString(address(factory)),
            '",\n  "feeReceiver": "', vm.toString(deployer),
            '",\n  "arbitrator": "', vm.toString(deployer),
            '"\n}\n'
        );
        string memory path = string.concat("deployments/", vm.toString(block.chainid), ".json");
        vm.writeFile(path, json);
        console.log("Wrote:", path);
    }
}
