// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {DisasterReliefSystem} from "../src/DisasterReliefSystem.sol";

contract DeployDisasterRelief is Script {
    DisasterReliefSystem public disasterRelief;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the main contract
        disasterRelief = new DisasterReliefSystem();

        console.log("DisasterReliefSystem deployed to:", address(disasterRelief));
        console.log("Owner:", disasterRelief.owner());

        // Verify deployment by checking owner
        address owner = disasterRelief.owner();
        require(owner != address(0), "Deployment failed - owner is zero address");

        vm.stopBroadcast();

        // Log deployment information
        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("Contract Address:", address(disasterRelief));
        console.log("Network: Avalanche Fuji Testnet");
        console.log("Chain ID: 43113");
        console.log("Explorer: https://testnet.snowtrace.io/address/%s", address(disasterRelief));
        
        // Save deployment info to file for frontend integration
        _saveDeploymentInfo();
    }

    function _saveDeploymentInfo() internal view {
        // This would typically write to a JSON file for frontend integration
        // For now, we'll just log the important information
        console.log("\n=== FRONTEND INTEGRATION ===");
        console.log("Add this to your frontend environment:");
        console.log("VITE_DISASTER_RELIEF_CONTRACT=%s", address(disasterRelief));
        console.log("VITE_NETWORK_CHAIN_ID=43113");
        console.log("VITE_NETWORK_NAME=Avalanche Fuji Testnet");
    }

    // Helper function to deploy with initial setup
    function deployWithInitialSetup() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy contract
        disasterRelief = new DisasterReliefSystem();

        // Add additional admins if specified
        address[] memory initialAdmins = _getInitialAdmins();
        for (uint i = 0; i < initialAdmins.length; i++) {
            if (initialAdmins[i] != deployer && initialAdmins[i] != address(0)) {
                disasterRelief.addAdmin(initialAdmins[i]);
                console.log("Added admin:", initialAdmins[i]);
            }
        }

        // Create initial disaster zone if needed (for testing)
        if (vm.envOr("CREATE_TEST_ZONE", false)) {
            _createTestDisasterZone();
        }

        vm.stopBroadcast();

        console.log("Deployment with setup complete!");
    }

    function _getInitialAdmins() internal pure returns (address[] memory) {
        // In a real deployment, these would come from environment variables
        address[] memory admins = new address[](2);
        // Add specific admin addresses here
        // admins[0] = 0x...; // Admin 1 address
        // admins[1] = 0x...; // Admin 2 address
        return admins;
    }

    function _createTestDisasterZone() internal {
        // Create a test disaster zone for immediate testing
        uint256 zoneId = disasterRelief.createDisasterZone(
            "Test Disaster Zone - Turkey Earthquake",
            37123456, // 37.123456 degrees latitude
            35987654, // 35.987654 degrees longitude
            50000,    // 50km radius
            1000000   // 1M units initial funding
        );

        console.log("Created test disaster zone with ID:", zoneId);
    }

    // Verification functions for post-deployment checks
    function verifyDeployment(address contractAddress) public view {
        DisasterReliefSystem deployed = DisasterReliefSystem(contractAddress);
        
        require(deployed.owner() != address(0), "Invalid contract - no owner");
        require(deployed.disasterZoneCounter() == 1, "Invalid contract - counter not initialized");
        
        console.log("Contract verification passed!");
        console.log("Owner:", deployed.owner());
        console.log("Disaster Zone Counter:", deployed.disasterZoneCounter());
        console.log("Voucher Counter:", deployed.voucherCounter());
        console.log("Proof Counter:", deployed.proofCounter());
    }
}
