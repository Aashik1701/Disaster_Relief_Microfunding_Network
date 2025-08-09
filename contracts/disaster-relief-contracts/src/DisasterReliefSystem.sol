// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DisasterReliefSystem
 * @dev Main contract for managing disaster relief operations on Avalanche
 * @notice This contract handles disaster zones, vendor registration, voucher management, and proof-of-aid
 */
contract DisasterReliefSystem {
    // State variables
    address public owner;
    uint256 public disasterZoneCounter;
    uint256 public voucherCounter;
    uint256 public proofCounter;

    // Roles
    mapping(address => bool) public admins;
    mapping(address => bool) public vendors;
    mapping(uint256 => mapping(address => bool)) public zoneVendors; // zoneId => vendor => authorized

    // Core structures
    struct DisasterZone {
        uint256 id;
        string name;
        int256 latitude;   // Latitude in wei (multiply by 1e8 for precision)
        int256 longitude;  // Longitude in wei (multiply by 1e8 for precision)
        uint256 radius;    // Radius in meters
        uint256 initialFunding;
        uint256 currentFunding;
        uint256 totalSpent;
        bool active;
        uint256 createdAt;
        address createdBy;
    }

    struct Vendor {
        address vendorAddress;
        string name;
        string location;
        uint256 disasterZoneId;
        string ipfsKycHash;
        bool verified;
        uint256 totalRedeemed;
        uint256 transactionCount;
        uint256 reputationScore; // 0-100
        uint256 registeredAt;
    }

    struct Voucher {
        uint256 id;
        address beneficiary;
        uint256 amount;
        uint256 disasterZoneId;
        string[] allowedCategories;
        uint256 createdAt;
        uint256 expiryTime;
        bool used;
        address usedBy; // vendor who redeemed it
        uint256 usedAt;
    }

    struct ProofOfAid {
        uint256 id;
        uint256 voucherId;
        uint256 amount;
        address vendor;
        address beneficiary;
        string ipfsHash;
        string category;
        uint256 timestamp;
        bool verified;
    }

    // Storage mappings
    mapping(uint256 => DisasterZone) public disasterZones;
    mapping(address => Vendor) public vendorRegistry;
    mapping(uint256 => Voucher) public vouchers;
    mapping(uint256 => ProofOfAid) public proofOfAids;
    
    // Helper mappings
    mapping(uint256 => address[]) public zoneVendorList; // zoneId => vendor addresses
    mapping(address => uint256[]) public userVouchers; // user => voucher IDs
    mapping(address => uint256[]) public vendorTransactions; // vendor => proof IDs

    // Events
    event DisasterZoneCreated(
        uint256 indexed zoneId, 
        string name, 
        int256 latitude, 
        int256 longitude, 
        uint256 radius,
        uint256 funding, 
        address indexed creator
    );
    
    event VendorRegistered(
        address indexed vendor, 
        uint256 indexed zoneId, 
        string name,
        string ipfsKycHash
    );
    
    event VendorVerified(
        address indexed vendor, 
        uint256 indexed zoneId,
        address indexed verifier
    );
    
    event VoucherIssued(
        uint256 indexed voucherId,
        address indexed beneficiary, 
        uint256 amount, 
        uint256 indexed disasterZoneId,
        string[] allowedCategories
    );
    
    event VoucherRedeemed(
        uint256 indexed voucherId,
        address indexed vendor, 
        address indexed beneficiary,
        uint256 amount,
        string category
    );
    
    event ProofOfAidSubmitted(
        uint256 indexed proofId, 
        uint256 indexed voucherId, 
        address indexed vendor,
        string ipfsHash,
        string category,
        uint256 amount
    );
    
    event FundsDeposited(
        uint256 indexed zoneId, 
        uint256 amount, 
        address indexed depositor
    );

    event AdminAdded(address indexed admin, address indexed addedBy);
    event AdminRemoved(address indexed admin, address indexed removedBy);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Not an admin");
        _;
    }

    modifier onlyVerifiedVendor() {
        require(vendors[msg.sender] && vendorRegistry[msg.sender].verified, "Not a verified vendor");
        _;
    }

    modifier onlyActiveZone(uint256 _zoneId) {
        require(disasterZones[_zoneId].active, "Disaster zone not active");
        _;
    }

    modifier onlyZoneVendor(uint256 _zoneId) {
        require(zoneVendors[_zoneId][msg.sender], "Not authorized for this zone");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
        disasterZoneCounter = 1;
        voucherCounter = 1;
        proofCounter = 1;
    }

    // Admin management functions
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid admin address");
        require(!admins[_admin], "Already an admin");
        
        admins[_admin] = true;
        emit AdminAdded(_admin, msg.sender);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != owner, "Cannot remove owner");
        require(admins[_admin], "Not an admin");
        
        admins[_admin] = false;
        emit AdminRemoved(_admin, msg.sender);
    }

    // Disaster zone management
    function createDisasterZone(
        string memory _name,
        int256 _latitude,
        int256 _longitude,
        uint256 _radius,
        uint256 _initialFunding
    ) external onlyAdmin returns (uint256) {
        require(bytes(_name).length > 0, "Invalid disaster zone name");
        require(_radius > 0, "Invalid radius");

        uint256 zoneId = disasterZoneCounter;
        
        disasterZones[zoneId] = DisasterZone({
            id: zoneId,
            name: _name,
            latitude: _latitude,
            longitude: _longitude,
            radius: _radius,
            initialFunding: _initialFunding,
            currentFunding: _initialFunding,
            totalSpent: 0,
            active: true,
            createdAt: block.timestamp,
            createdBy: msg.sender
        });

        disasterZoneCounter++;

        emit DisasterZoneCreated(zoneId, _name, _latitude, _longitude, _radius, _initialFunding, msg.sender);
        
        if (_initialFunding > 0) {
            emit FundsDeposited(zoneId, _initialFunding, msg.sender);
        }

        return zoneId;
    }

    function updateDisasterZoneStatus(uint256 _zoneId, bool _active) external onlyAdmin {
        require(disasterZones[_zoneId].id != 0, "Disaster zone does not exist");
        
        disasterZones[_zoneId].active = _active;
    }

    function addFunding(uint256 _zoneId, uint256 _amount) external onlyAdmin onlyActiveZone(_zoneId) {
        require(_amount > 0, "Invalid funding amount");
        
        disasterZones[_zoneId].currentFunding += _amount;
        
        emit FundsDeposited(_zoneId, _amount, msg.sender);
    }

    // Vendor management
    function registerVendor(
        address _vendorAddress,
        string memory _name,
        string memory _location,
        uint256 _disasterZoneId,
        string memory _ipfsKycHash
    ) external onlyAdmin onlyActiveZone(_disasterZoneId) {
        require(_vendorAddress != address(0), "Invalid vendor address");
        require(bytes(_name).length > 0, "Invalid vendor name");
        require(!vendors[_vendorAddress], "Vendor already registered");

        vendorRegistry[_vendorAddress] = Vendor({
            vendorAddress: _vendorAddress,
            name: _name,
            location: _location,
            disasterZoneId: _disasterZoneId,
            ipfsKycHash: _ipfsKycHash,
            verified: false,
            totalRedeemed: 0,
            transactionCount: 0,
            reputationScore: 50, // Start with neutral score
            registeredAt: block.timestamp
        });

        vendors[_vendorAddress] = true;
        zoneVendorList[_disasterZoneId].push(_vendorAddress);

        emit VendorRegistered(_vendorAddress, _disasterZoneId, _name, _ipfsKycHash);
    }

    function verifyVendor(address _vendorAddress, uint256 _disasterZoneId) external onlyAdmin {
        require(vendors[_vendorAddress], "Vendor not registered");
        require(vendorRegistry[_vendorAddress].disasterZoneId == _disasterZoneId, "Vendor not in this zone");
        
        vendorRegistry[_vendorAddress].verified = true;
        zoneVendors[_disasterZoneId][_vendorAddress] = true;

        emit VendorVerified(_vendorAddress, _disasterZoneId, msg.sender);
    }

    // Voucher management
    function issueVoucher(
        address _beneficiary,
        uint256 _amount,
        uint256 _disasterZoneId,
        string[] memory _allowedCategories,
        uint256 _expiryDays
    ) external onlyAdmin onlyActiveZone(_disasterZoneId) returns (uint256) {
        require(_beneficiary != address(0), "Invalid beneficiary address");
        require(_amount > 0, "Invalid voucher amount");
        require(_allowedCategories.length > 0, "Must specify allowed categories");
        require(disasterZones[_disasterZoneId].currentFunding >= _amount, "Insufficient funds in disaster zone");

        uint256 voucherId = voucherCounter;
        uint256 expiryTime = block.timestamp + (_expiryDays * 1 days);

        vouchers[voucherId] = Voucher({
            id: voucherId,
            beneficiary: _beneficiary,
            amount: _amount,
            disasterZoneId: _disasterZoneId,
            allowedCategories: _allowedCategories,
            createdAt: block.timestamp,
            expiryTime: expiryTime,
            used: false,
            usedBy: address(0),
            usedAt: 0
        });

        userVouchers[_beneficiary].push(voucherId);
        voucherCounter++;

        // Reserve funds
        disasterZones[_disasterZoneId].currentFunding -= _amount;

        emit VoucherIssued(voucherId, _beneficiary, _amount, _disasterZoneId, _allowedCategories);

        return voucherId;
    }

    function redeemVoucher(
        uint256 _voucherId,
        uint256 _amount,
        string memory _category,
        string memory _ipfsHash
    ) external onlyVerifiedVendor onlyZoneVendor(vouchers[_voucherId].disasterZoneId) {
        Voucher storage voucher = vouchers[_voucherId];
        
        require(!voucher.used, "Voucher already used");
        require(block.timestamp <= voucher.expiryTime, "Voucher expired");
        require(_amount <= voucher.amount, "Amount exceeds voucher value");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(_isCategoryAllowed(_category, voucher.allowedCategories), "Category not allowed");

        // Mark voucher as used
        voucher.used = true;
        voucher.usedBy = msg.sender;
        voucher.usedAt = block.timestamp;

        // Create proof of aid
        uint256 proofId = proofCounter;
        proofOfAids[proofId] = ProofOfAid({
            id: proofId,
            voucherId: _voucherId,
            amount: _amount,
            vendor: msg.sender,
            beneficiary: voucher.beneficiary,
            ipfsHash: _ipfsHash,
            category: _category,
            timestamp: block.timestamp,
            verified: false
        });

        vendorTransactions[msg.sender].push(proofId);
        proofCounter++;

        // Update vendor stats
        Vendor storage vendor = vendorRegistry[msg.sender];
        vendor.totalRedeemed += _amount;
        vendor.transactionCount++;

        // Update disaster zone spending
        disasterZones[voucher.disasterZoneId].totalSpent += _amount;

        emit VoucherRedeemed(_voucherId, msg.sender, voucher.beneficiary, _amount, _category);
        emit ProofOfAidSubmitted(proofId, _voucherId, msg.sender, _ipfsHash, _category, _amount);
    }

    // Helper functions
    function _isCategoryAllowed(string memory _category, string[] memory _allowedCategories) 
        internal 
        pure 
        returns (bool) 
    {
        for (uint i = 0; i < _allowedCategories.length; i++) {
            if (keccak256(bytes(_category)) == keccak256(bytes(_allowedCategories[i]))) {
                return true;
            }
        }
        return false;
    }

    // View functions
    function getDisasterZone(uint256 _zoneId) external view returns (DisasterZone memory) {
        return disasterZones[_zoneId];
    }

    function getVendor(address _vendorAddress) external view returns (Vendor memory) {
        return vendorRegistry[_vendorAddress];
    }

    function getVoucher(uint256 _voucherId) external view returns (Voucher memory) {
        return vouchers[_voucherId];
    }

    function getProofOfAid(uint256 _proofId) external view returns (ProofOfAid memory) {
        return proofOfAids[_proofId];
    }

    function getZoneVendors(uint256 _zoneId) external view returns (address[] memory) {
        return zoneVendorList[_zoneId];
    }

    function getUserVouchers(address _user) external view returns (uint256[] memory) {
        return userVouchers[_user];
    }

    function getVendorTransactions(address _vendor) external view returns (uint256[] memory) {
        return vendorTransactions[_vendor];
    }

    function getDisasterZoneStats(uint256 _zoneId) external view returns (
        string memory name,
        bool active,
        uint256 initialFunding,
        uint256 currentFunding,
        uint256 totalSpent,
        uint256 vendorCount
    ) {
        DisasterZone memory zone = disasterZones[_zoneId];
        return (
            zone.name,
            zone.active,
            zone.initialFunding,
            zone.currentFunding,
            zone.totalSpent,
            zoneVendorList[_zoneId].length
        );
    }

    // Emergency functions
    function emergencyPause(uint256 _zoneId) external onlyAdmin {
        disasterZones[_zoneId].active = false;
    }

    function emergencyWithdraw(uint256 _zoneId, uint256 _amount) external onlyOwner {
        require(_amount <= disasterZones[_zoneId].currentFunding, "Insufficient funds");
        disasterZones[_zoneId].currentFunding -= _amount;
        // In a real implementation, this would transfer actual tokens
    }

    // Proof verification (for admins to verify submitted proofs)
    function verifyProofOfAid(uint256 _proofId) external onlyAdmin {
        require(proofOfAids[_proofId].id != 0, "Proof does not exist");
        proofOfAids[_proofId].verified = true;
        
        // Update vendor reputation based on verified proof
        address vendor = proofOfAids[_proofId].vendor;
        if (vendorRegistry[vendor].reputationScore < 100) {
            vendorRegistry[vendor].reputationScore += 1;
        }
    }
}
