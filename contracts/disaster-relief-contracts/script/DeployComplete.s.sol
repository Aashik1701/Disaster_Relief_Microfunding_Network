// SPDX-License-Identifier: MIT
p        // Deploy DisasterReliefSystem
        console.log("Deploying DisasterReliefSystem...");
        DisasterReliefSystem disasterRelief = new DisasterReliefSystem();
        console.log("DisasterReliefSystem deployed at:", address(disasterRelief));

        // Mint some initial USDC to deployer for testing
        console.log("Minting initial USDC for testing...");
        mockUSDC.faucet(); // 1000 USDC to deployer
        
        // Check if deployer has admin role (they should as owner)
        console.log("Verifying admin role for deployer...");
        bool hasAdminRole = disasterRelief.admins(deployerAddress);
        console.log("Deployer has admin role:", hasAdminRole); ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {DisasterReliefSystem} from "../src/DisasterReliefSystem.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract DeployComplete is Script {
    DisasterReliefSystem public disasterRelief;
    MockUSDC public mockUSDC;

    function run() public {
        // Use default foundry account or provided private key
        uint256 deployerPrivateKey;
        
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            // Use default foundry test private key if none provided
            deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
            console.log("Using default Foundry test account for deployment");
        }

        address deployerAddress = vm.addr(deployerPrivateKey);
        console.log("Deploying contracts with address:", deployerAddress);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MockUSDC first
        console.log("Deploying MockUSDC...");
        mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed at:", address(mockUSDC));

        // Deploy DisasterReliefSystem
        console.log("Deploying DisasterReliefSystem...");
        disasterRelief = new DisasterReliefSystem(address(mockUSDC));
        console.log("DisasterReliefSystem deployed at:", address(disasterRelief));

        // Mint some initial USDC to deployer for testing
        console.log("Minting initial USDC for testing...");
        mockUSDC.faucet(); // 1000 USDC to deployer
        
        // Give deployer admin role (they should already have it as deployer)
        console.log("Verifying admin role for deployer...");
        bytes32 adminRole = disasterRelief.DEFAULT_ADMIN_ROLE();
        bool hasAdminRole = disasterRelief.hasRole(adminRole, deployerAddress);
        console.log("Deployer has admin role:", hasAdminRole);

        vm.stopBroadcast();

        // Log deployment info
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Network: Avalanche Fuji Testnet");
        console.log("Deployer:", deployerAddress);
        console.log("DisasterReliefSystem:", address(disasterRelief));
        console.log("MockUSDC:", address(mockUSDC));
        console.log("Initial USDC balance:", mockUSDC.balanceOf(deployerAddress));
        
        // Generate environment file content
        console.log("\n=== ENVIRONMENT VARIABLES ===");
        console.log("VITE_DISASTER_RELIEF_CONTRACT=", address(disasterRelief));
        console.log("VITE_MOCK_USDC_CONTRACT=", address(mockUSDC));
        
        // Create test disaster zone for demo
        console.log("\n=== CREATING TEST DATA ===");
        vm.startBroadcast(deployerPrivateKey);
        
        // Create a test disaster zone (New York area coordinates)
        // Latitude: 40.7128, Longitude: -74.0060, Radius: 50km
        int256 lat = 40712800; // 40.7128 * 1e6
        int256 lng = -74006000; // -74.0060 * 1e6
        uint256 radius = 50000; // 50km in meters
        uint256 initialFunding = 10000 * 1e6; // 10,000 USDC
        
        // Approve USDC spending first
        mockUSDC.approve(address(disasterRelief), initialFunding);
        
        disasterRelief.createDisasterZone(
            "Hurricane Sandy Relief Zone",
            lat,
            lng,
            radius,
            initialFunding
        );
        
        console.log("Test disaster zone created: Hurricane Sandy Relief Zone");
        console.log("Location: New York (40.7128, -74.0060)");
        console.log("Radius: 50km");
        console.log("Initial funding: 10,000 USDC");
        
        vm.stopBroadcast();
        
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Update frontend/.env with the contract addresses above");
        console.log("2. Update frontend/src/contracts/index.js with contract addresses");
        console.log("3. Verify contracts on Snowtrace if needed");
        console.log("4. Fund the deployer account with AVAX for gas fees");
        console.log("5. Test the application end-to-end");
    }
}
