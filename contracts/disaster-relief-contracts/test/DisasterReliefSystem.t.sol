// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DisasterReliefSystem} from "../src/DisasterReliefSystem.sol";

contract DisasterReliefSystemTest is Test {
    DisasterReliefSystem public disasterRelief;
    
    address public owner = address(1);
    address public admin = address(2);
    address public vendor1 = address(3);
    address public vendor2 = address(4);
    address public beneficiary1 = address(5);
    address public beneficiary2 = address(6);
    address public nonAdmin = address(7);

    // Test data
    string constant DISASTER_NAME = "Turkey Earthquake 2023";
    int256 constant LATITUDE = 37123456; // 37.123456 degrees * 1e6 for precision
    int256 constant LONGITUDE = 35987654; // 35.987654 degrees * 1e6 for precision
    uint256 constant RADIUS = 50000; // 50km in meters
    uint256 constant INITIAL_FUNDING = 1000000; // 1M units

    string constant VENDOR_NAME = "Local Food Bank";
    string constant VENDOR_LOCATION = "Ankara, Turkey";
    string constant IPFS_KYC_HASH = "QmTestKYCHash123";

    event DisasterZoneCreated(
        uint256 indexed zoneId, 
        string name, 
        int256 latitude, 
        int256 longitude, 
        uint256 radius,
        uint256 funding, 
        address indexed creator
    );

    function setUp() public {
        vm.startPrank(owner);
        disasterRelief = new DisasterReliefSystem();
        
        // Add admin
        disasterRelief.addAdmin(admin);
        vm.stopPrank();
    }

    // Test disaster zone creation
    function testCreateDisasterZone() public {
        vm.startPrank(admin);
        
        vm.expectEmit(true, false, false, true);
        emit DisasterZoneCreated(1, DISASTER_NAME, LATITUDE, LONGITUDE, RADIUS, INITIAL_FUNDING, admin);
        
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );
        
        assertEq(zoneId, 1);
        
        // Verify disaster zone data
        DisasterReliefSystem.DisasterZone memory zone = disasterRelief.getDisasterZone(1);
        assertEq(zone.name, DISASTER_NAME);
        assertEq(zone.latitude, LATITUDE);
        assertEq(zone.longitude, LONGITUDE);
        assertEq(zone.radius, RADIUS);
        assertEq(zone.initialFunding, INITIAL_FUNDING);
        assertEq(zone.currentFunding, INITIAL_FUNDING);
        assertEq(zone.totalSpent, 0);
        assertTrue(zone.active);
        assertEq(zone.createdBy, admin);
        
        vm.stopPrank();
    }

    function testCreateDisasterZoneFailsForNonAdmin() public {
        vm.startPrank(nonAdmin);
        
        vm.expectRevert("Not an admin");
        disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );
        
        vm.stopPrank();
    }

    function testCreateDisasterZoneFailsWithInvalidData() public {
        vm.startPrank(admin);
        
        // Test empty name
        vm.expectRevert("Invalid disaster zone name");
        disasterRelief.createDisasterZone("", LATITUDE, LONGITUDE, RADIUS, INITIAL_FUNDING);
        
        // Test zero radius
        vm.expectRevert("Invalid radius");
        disasterRelief.createDisasterZone(DISASTER_NAME, LATITUDE, LONGITUDE, 0, INITIAL_FUNDING);
        
        vm.stopPrank();
    }

    // Test vendor registration
    function testRegisterVendor() public {
        // First create a disaster zone
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        // Register vendor
        disasterRelief.registerVendor(
            vendor1,
            VENDOR_NAME,
            VENDOR_LOCATION,
            zoneId,
            IPFS_KYC_HASH
        );

        // Verify vendor registration
        DisasterReliefSystem.Vendor memory vendor = disasterRelief.getVendor(vendor1);
        assertEq(vendor.vendorAddress, vendor1);
        assertEq(vendor.name, VENDOR_NAME);
        assertEq(vendor.location, VENDOR_LOCATION);
        assertEq(vendor.disasterZoneId, zoneId);
        assertEq(vendor.ipfsKycHash, IPFS_KYC_HASH);
        assertFalse(vendor.verified);
        assertEq(vendor.totalRedeemed, 0);
        assertEq(vendor.transactionCount, 0);
        assertEq(vendor.reputationScore, 50);

        assertTrue(disasterRelief.vendors(vendor1));
        
        vm.stopPrank();
    }

    function testVerifyVendor() public {
        // Setup: create zone and register vendor
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(
            vendor1,
            VENDOR_NAME,
            VENDOR_LOCATION,
            zoneId,
            IPFS_KYC_HASH
        );

        // Verify vendor
        disasterRelief.verifyVendor(vendor1, zoneId);

        // Check verification status
        DisasterReliefSystem.Vendor memory vendor = disasterRelief.getVendor(vendor1);
        assertTrue(vendor.verified);
        
        vm.stopPrank();
    }

    // Test voucher issuance
    function testIssueVoucher() public {
        // Setup
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        string[] memory categories = new string[](3);
        categories[0] = "Food";
        categories[1] = "Medical";
        categories[2] = "Shelter";

        uint256 voucherAmount = 1000;
        uint256 expiryDays = 30;

        uint256 voucherId = disasterRelief.issueVoucher(
            beneficiary1,
            voucherAmount,
            zoneId,
            categories,
            expiryDays
        );

        assertEq(voucherId, 1);

        // Verify voucher data
        DisasterReliefSystem.Voucher memory voucher = disasterRelief.getVoucher(1);
        assertEq(voucher.beneficiary, beneficiary1);
        assertEq(voucher.amount, voucherAmount);
        assertEq(voucher.disasterZoneId, zoneId);
        assertFalse(voucher.used);
        assertEq(voucher.allowedCategories.length, 3);
        assertEq(voucher.allowedCategories[0], "Food");

        // Check that funds were reserved
        DisasterReliefSystem.DisasterZone memory zone = disasterRelief.getDisasterZone(zoneId);
        assertEq(zone.currentFunding, INITIAL_FUNDING - voucherAmount);

        vm.stopPrank();
    }

    function testIssueVoucherFailsWithInsufficientFunds() public {
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            1000 // Small funding
        );

        string[] memory categories = new string[](1);
        categories[0] = "Food";

        vm.expectRevert("Insufficient funds in disaster zone");
        disasterRelief.issueVoucher(
            beneficiary1,
            2000, // More than available funding
            zoneId,
            categories,
            30
        );

        vm.stopPrank();
    }

    // Test voucher redemption
    function testRedeemVoucher() public {
        // Setup: create zone, register and verify vendor, issue voucher
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(
            vendor1,
            VENDOR_NAME,
            VENDOR_LOCATION,
            zoneId,
            IPFS_KYC_HASH
        );

        disasterRelief.verifyVendor(vendor1, zoneId);

        string[] memory categories = new string[](2);
        categories[0] = "Food";
        categories[1] = "Medical";

        uint256 voucherAmount = 1000;
        uint256 voucherId = disasterRelief.issueVoucher(
            beneficiary1,
            voucherAmount,
            zoneId,
            categories,
            30
        );
        vm.stopPrank();

        // Redeem voucher
        vm.startPrank(vendor1);
        string memory category = "Food";
        string memory ipfsHash = "QmTestProofHash123";
        
        disasterRelief.redeemVoucher(voucherId, voucherAmount, category, ipfsHash);

        // Verify voucher was marked as used
        DisasterReliefSystem.Voucher memory voucher = disasterRelief.getVoucher(voucherId);
        assertTrue(voucher.used);
        assertEq(voucher.usedBy, vendor1);

        // Verify proof of aid was created
        DisasterReliefSystem.ProofOfAid memory proof = disasterRelief.getProofOfAid(1);
        assertEq(proof.voucherId, voucherId);
        assertEq(proof.amount, voucherAmount);
        assertEq(proof.vendor, vendor1);
        assertEq(proof.beneficiary, beneficiary1);
        assertEq(proof.ipfsHash, ipfsHash);
        assertEq(proof.category, category);
        assertFalse(proof.verified);

        // Verify vendor stats updated
        DisasterReliefSystem.Vendor memory vendorData = disasterRelief.getVendor(vendor1);
        assertEq(vendorData.totalRedeemed, voucherAmount);
        assertEq(vendorData.transactionCount, 1);

        // Verify disaster zone spending updated
        DisasterReliefSystem.DisasterZone memory zone = disasterRelief.getDisasterZone(zoneId);
        assertEq(zone.totalSpent, voucherAmount);

        vm.stopPrank();
    }

    function testRedeemVoucherFailsWithInvalidCategory() public {
        // Setup
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(vendor1, VENDOR_NAME, VENDOR_LOCATION, zoneId, IPFS_KYC_HASH);
        disasterRelief.verifyVendor(vendor1, zoneId);

        string[] memory categories = new string[](1);
        categories[0] = "Food";

        uint256 voucherId = disasterRelief.issueVoucher(beneficiary1, 1000, zoneId, categories, 30);
        vm.stopPrank();

        // Try to redeem with invalid category
        vm.startPrank(vendor1);
        vm.expectRevert("Category not allowed");
        disasterRelief.redeemVoucher(voucherId, 1000, "Clothing", "QmTestHash");
        vm.stopPrank();
    }

    // Test admin management
    function testAddAdmin() public {
        vm.startPrank(owner);
        
        assertFalse(disasterRelief.admins(nonAdmin));
        disasterRelief.addAdmin(nonAdmin);
        assertTrue(disasterRelief.admins(nonAdmin));
        
        vm.stopPrank();
    }

    function testAddAdminFailsForNonOwner() public {
        vm.startPrank(admin);
        
        vm.expectRevert("Not the contract owner");
        disasterRelief.addAdmin(nonAdmin);
        
        vm.stopPrank();
    }

    function testRemoveAdmin() public {
        vm.startPrank(owner);
        
        assertTrue(disasterRelief.admins(admin));
        disasterRelief.removeAdmin(admin);
        assertFalse(disasterRelief.admins(admin));
        
        vm.stopPrank();
    }

    function testCannotRemoveOwnerAsAdmin() public {
        vm.startPrank(owner);
        
        vm.expectRevert("Cannot remove owner");
        disasterRelief.removeAdmin(owner);
        
        vm.stopPrank();
    }

    // Test view functions
    function testGetDisasterZoneStats() public {
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(vendor1, VENDOR_NAME, VENDOR_LOCATION, zoneId, IPFS_KYC_HASH);
        disasterRelief.registerVendor(vendor2, "Vendor 2", "Location 2", zoneId, "Hash2");

        (
            string memory name,
            bool active,
            uint256 initialFunding,
            uint256 currentFunding,
            uint256 totalSpent,
            uint256 vendorCount
        ) = disasterRelief.getDisasterZoneStats(zoneId);

        assertEq(name, DISASTER_NAME);
        assertTrue(active);
        assertEq(initialFunding, INITIAL_FUNDING);
        assertEq(currentFunding, INITIAL_FUNDING);
        assertEq(totalSpent, 0);
        assertEq(vendorCount, 2);

        vm.stopPrank();
    }

    function testGetZoneVendors() public {
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(vendor1, VENDOR_NAME, VENDOR_LOCATION, zoneId, IPFS_KYC_HASH);
        disasterRelief.registerVendor(vendor2, "Vendor 2", "Location 2", zoneId, "Hash2");

        address[] memory vendors = disasterRelief.getZoneVendors(zoneId);
        assertEq(vendors.length, 2);
        assertEq(vendors[0], vendor1);
        assertEq(vendors[1], vendor2);

        vm.stopPrank();
    }

    function testVerifyProofOfAid() public {
        // Setup and create a proof
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(vendor1, VENDOR_NAME, VENDOR_LOCATION, zoneId, IPFS_KYC_HASH);
        disasterRelief.verifyVendor(vendor1, zoneId);

        string[] memory categories = new string[](1);
        categories[0] = "Food";

        uint256 voucherId = disasterRelief.issueVoucher(beneficiary1, 1000, zoneId, categories, 30);
        vm.stopPrank();

        vm.startPrank(vendor1);
        disasterRelief.redeemVoucher(voucherId, 1000, "Food", "QmTestHash");
        vm.stopPrank();

        // Verify the proof
        vm.startPrank(admin);
        DisasterReliefSystem.ProofOfAid memory proofBefore = disasterRelief.getProofOfAid(1);
        assertFalse(proofBefore.verified);

        disasterRelief.verifyProofOfAid(1);

        DisasterReliefSystem.ProofOfAid memory proofAfter = disasterRelief.getProofOfAid(1);
        assertTrue(proofAfter.verified);

        // Check that vendor reputation increased
        DisasterReliefSystem.Vendor memory vendorData = disasterRelief.getVendor(vendor1);
        assertEq(vendorData.reputationScore, 51);

        vm.stopPrank();
    }

    // Test emergency functions
    function testEmergencyPause() public {
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        assertTrue(disasterRelief.getDisasterZone(zoneId).active);
        
        disasterRelief.emergencyPause(zoneId);
        
        assertFalse(disasterRelief.getDisasterZone(zoneId).active);
        vm.stopPrank();
    }

    function testEmergencyWithdraw() public {
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );
        vm.stopPrank();

        vm.startPrank(owner);
        uint256 withdrawAmount = 100000;
        
        disasterRelief.emergencyWithdraw(zoneId, withdrawAmount);
        
        DisasterReliefSystem.DisasterZone memory zone = disasterRelief.getDisasterZone(zoneId);
        assertEq(zone.currentFunding, INITIAL_FUNDING - withdrawAmount);
        vm.stopPrank();
    }

    // Test edge cases
    function testVoucherExpiry() public {
        // Setup
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(vendor1, VENDOR_NAME, VENDOR_LOCATION, zoneId, IPFS_KYC_HASH);
        disasterRelief.verifyVendor(vendor1, zoneId);

        string[] memory categories = new string[](1);
        categories[0] = "Food";

        uint256 voucherId = disasterRelief.issueVoucher(beneficiary1, 1000, zoneId, categories, 1); // 1 day expiry
        vm.stopPrank();

        // Fast forward time beyond expiry
        vm.warp(block.timestamp + 2 days);

        // Try to redeem expired voucher
        vm.startPrank(vendor1);
        vm.expectRevert("Voucher expired");
        disasterRelief.redeemVoucher(voucherId, 1000, "Food", "QmTestHash");
        vm.stopPrank();
    }

    function testCannotRedeemUsedVoucher() public {
        // Setup and redeem voucher once
        vm.startPrank(admin);
        uint256 zoneId = disasterRelief.createDisasterZone(
            DISASTER_NAME,
            LATITUDE,
            LONGITUDE,
            RADIUS,
            INITIAL_FUNDING
        );

        disasterRelief.registerVendor(vendor1, VENDOR_NAME, VENDOR_LOCATION, zoneId, IPFS_KYC_HASH);
        disasterRelief.verifyVendor(vendor1, zoneId);

        string[] memory categories = new string[](1);
        categories[0] = "Food";

        uint256 voucherId = disasterRelief.issueVoucher(beneficiary1, 1000, zoneId, categories, 30);
        vm.stopPrank();

        vm.startPrank(vendor1);
        disasterRelief.redeemVoucher(voucherId, 1000, "Food", "QmTestHash1");

        // Try to redeem again
        vm.expectRevert("Voucher already used");
        disasterRelief.redeemVoucher(voucherId, 1000, "Food", "QmTestHash2");
        vm.stopPrank();
    }
}
