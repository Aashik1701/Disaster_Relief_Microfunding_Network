# 🚀 Avalanche Disaster Relief Network - Smart Contracts

## 📋 Overview

This directory contains all smart contracts, deployment scripts, tests, and configuration files for the Avalanche Disaster Relief Network. The system provides a transparent, blockchain-powered solution for disaster relief distribution using geo-locked zones, vendor management, and voucher-based aid distribution.

---

## 📁 Directory Structure

```
contracts/
└── disaster-relief-contracts/
    ├── src/                    # Smart contract source files
    ├── script/                 # Deployment scripts
    ├── test/                   # Test files
    ├── lib/                    # External dependencies (Forge STD)
    ├── out/                    # Compiled contracts
    ├── broadcast/              # Deployment records
    ├── cache/                  # Compilation cache
    ├── foundry.toml           # Foundry configuration
    ├── .env.example           # Environment variables template
    └── README.md              # Project documentation
```

---

## 🔗 Deployed Contracts (Avalanche Fuji Testnet)

### Main Contracts
- **DisasterReliefSystem:** `0x6a66fE30D16eceF92752A6C005f474b6125f847D`
- **MockUSDC:** `0xcB238E70da4Bf99b0c0e77c7f871c22b46e0980A`

### Network Information
- **Chain ID:** 43113 (Avalanche Fuji Testnet)
- **RPC URL:** `https://api.avax-test.network/ext/bc/C/rpc`
- **Block Explorer:** [Snowtrace Testnet](https://testnet.snowtrace.io/)

---

## 📄 Smart Contracts Documentation

### 1. DisasterReliefSystem.sol

**Purpose:** Main contract managing disaster relief operations with geo-location verification, vendor management, and voucher distribution.

#### 🏗️ Core Data Structures

```solidity
struct DisasterZone {
    uint256 id;                 // Unique zone identifier
    string name;                // Disaster zone name
    int256 latitude;            // Latitude in wei (1e6 precision)
    int256 longitude;           // Longitude in wei (1e6 precision)
    uint256 radius;             // Coverage radius in meters
    uint256 initialFunding;     // Initial USDC funding amount
    uint256 currentFunding;     // Current available funding
    uint256 totalSpent;         // Total amount spent
    bool active;                // Zone activation status
    uint256 createdAt;          // Creation timestamp
    address createdBy;          // Zone creator address
}

struct Vendor {
    address vendorAddress;      // Vendor's Ethereum address
    string name;                // Vendor business name
    string location;            // Physical location
    uint256 disasterZoneId;     // Associated disaster zone
    string ipfsKycHash;         // IPFS hash of KYC documents
    bool verified;              // Verification status
    uint256 totalRedeemed;      // Total USDC redeemed
    uint256 transactionCount;   // Number of transactions
    uint256 reputationScore;    // Reputation score (0-100)
    uint256 registeredAt;       // Registration timestamp
}

struct Voucher {
    uint256 id;                 // Unique voucher identifier
    address beneficiary;        // Voucher recipient
    uint256 amount;             // USDC amount in wei
    uint256 disasterZoneId;     // Associated disaster zone
    string[] allowedCategories; // Allowed spending categories
    uint256 createdAt;          // Creation timestamp
    uint256 expiryTime;         // Expiration timestamp
    bool used;                  // Usage status
    address usedBy;             // Vendor who redeemed
    uint256 usedAt;             // Redemption timestamp
}

struct ProofOfAid {
    uint256 id;                 // Unique proof identifier
    uint256 voucherId;          // Associated voucher ID
    uint256 amount;             // Transaction amount
    address vendor;             // Vendor address
    address beneficiary;        // Beneficiary address
    string ipfsHash;            // IPFS hash of proof documents
    string category;            // Aid category
    uint256 timestamp;          // Transaction timestamp
    bool verified;              // Verification status
}
```

#### 🔐 Access Control Functions

**Admin Management:**
- `addAdmin(address _admin)` - Add new admin (owner only)
- `removeAdmin(address _admin)` - Remove admin (owner only)
- `transferOwnership(address newOwner)` - Transfer contract ownership

**Emergency Controls:**
- `pauseContract()` - Pause all operations (admin only)
- `unpauseContract()` - Resume operations (admin only)
- `emergencyWithdraw()` - Emergency fund withdrawal (owner only)

#### 🌍 Disaster Zone Management

**Zone Creation & Management:**
- `createDisasterZone(string name, int256 lat, int256 lng, uint256 radius, uint256 funding)` 
  - Creates new geo-locked disaster zone
  - Validates coordinates and radius
  - Sets initial USDC funding
  - Returns unique zone ID

- `updateDisasterZone(uint256 zoneId, string name, bool active)`
  - Updates zone information
  - Can activate/deactivate zones

- `addFunding(uint256 zoneId, uint256 amount)`
  - Adds additional USDC funding to zone
  - Updates current funding balance

**Zone Information Retrieval:**
- `getDisasterZone(uint256 zoneId)` - Returns complete zone data
- `getDisasterZoneStats(uint256 zoneId)` - Returns zone statistics
- `isLocationInZone(uint256 zoneId, int256 lat, int256 lng)` - Verifies if coordinates are within zone

#### 👥 Vendor Management

**Vendor Registration:**
- `registerVendor(address vendor, string name, string location, uint256 zoneId, string ipfsKycHash)`
  - Registers new vendor for specific disaster zone
  - Stores KYC documents on IPFS
  - Requires admin approval for verification

- `verifyVendor(address vendor, uint256 zoneId)`
  - Verifies vendor after KYC review
  - Enables voucher redemption capability

**Vendor Information:**
- `getVendor(address vendor)` - Returns vendor details
- `getZoneVendors(uint256 zoneId)` - Lists all vendors in zone
- `updateVendorReputation(address vendor, uint256 score)` - Updates reputation score

#### 🎫 Voucher System

**Voucher Issuance:**
- `issueVoucher(address beneficiary, uint256 amount, uint256 zoneId, string[] categories, uint256 expiryDays)`
  - Issues USDC voucher to beneficiary
  - Sets spending categories and expiration
  - Validates zone funding availability

**Voucher Redemption:**
- `redeemVoucher(uint256 voucherId, uint256 amount, string category, string ipfsHash)`
  - Redeems voucher at verified vendor
  - Validates category restrictions
  - Creates proof-of-aid record on IPFS

**Voucher Management:**
- `getVoucher(uint256 voucherId)` - Returns voucher details
- `getUserVouchers(address user)` - Lists user's vouchers
- `extendVoucherExpiry(uint256 voucherId, uint256 additionalDays)` - Extends voucher validity

#### 📊 Transparency & Reporting

**Proof of Aid:**
- `submitProofOfAid(uint256 voucherId, string ipfsHash, string category)`
  - Submits proof documents to IPFS
  - Links to voucher transaction
  - Enables audit trail

**Analytics Functions:**
- `getTotalFunding(uint256 zoneId)` - Returns total zone funding
- `getTotalSpent(uint256 zoneId)` - Returns total zone expenditure
- `getVendorStats(address vendor)` - Returns vendor statistics
- `getProofOfAid(uint256 proofId)` - Returns proof details

#### 📢 Events

```solidity
event DisasterZoneCreated(uint256 indexed zoneId, string name, int256 latitude, int256 longitude, uint256 radius, uint256 funding, address indexed creator);
event VendorRegistered(address indexed vendor, uint256 indexed zoneId, string name, string ipfsKycHash);
event VendorVerified(address indexed vendor, uint256 indexed zoneId, address indexed verifiedBy);
event VoucherIssued(uint256 indexed voucherId, address indexed beneficiary, uint256 amount, uint256 indexed zoneId);
event VoucherRedeemed(uint256 indexed voucherId, address indexed vendor, address indexed beneficiary, uint256 amount, string category);
event ProofOfAidSubmitted(uint256 indexed proofId, uint256 indexed voucherId, address indexed vendor, string ipfsHash, string category, uint256 amount);
event FundingAdded(uint256 indexed zoneId, uint256 amount, address indexed funder);
event AdminAdded(address indexed admin, address indexed addedBy);
event AdminRemoved(address indexed admin, address indexed removedBy);
event EmergencyWithdraw(uint256 amount, address indexed withdrawnBy);
```

---

### 2. MockUSDC.sol

**Purpose:** ERC-20 compliant mock USDC token for testing purposes with built-in faucet functionality.

#### 🏗️ Token Properties
- **Name:** USD Coin (Mock)
- **Symbol:** USDC
- **Decimals:** 6 (standard USDC format)
- **Initial Supply:** 1,000,000 USDC (to deployer)

#### 💰 Core Functions

**Standard ERC-20:**
- `transfer(address to, uint256 amount)` - Transfer tokens
- `approve(address spender, uint256 amount)` - Approve spending
- `transferFrom(address from, address to, uint256 amount)` - Transfer from approved account
- `balanceOf(address account)` - Get account balance
- `allowance(address owner, address spender)` - Get approved amount

**Testing Functions:**
- `mint(address to, uint256 amount)` - Mint new tokens (unrestricted for testing)
- `faucet()` - Get 1000 USDC for testing (anyone can call)

#### 📢 Events
- `Transfer(address indexed from, address indexed to, uint256 value)`
- `Approval(address indexed owner, address indexed spender, uint256 value)`

---

## 🧪 Test Suite

### DisasterReliefSystem.t.sol

Comprehensive test suite with 22 test cases covering all contract functionality:

#### 🏗️ Setup & Configuration Tests
- `setUp()` - Initializes test environment with multiple user roles
- `testOwnershipAndAdminSetup()` - Verifies initial ownership and admin setup

#### 🌍 Disaster Zone Tests
- `testCreateDisasterZone()` - Validates zone creation with proper parameters
- `testCreateDisasterZoneFailsForNonAdmin()` - Ensures only admins can create zones
- `testCreateDisasterZoneFailsWithInvalidData()` - Tests input validation
- `testUpdateDisasterZone()` - Tests zone updates and status changes
- `testAddFunding()` - Validates funding addition functionality

#### 👥 Vendor Management Tests
- `testRegisterVendor()` - Tests vendor registration process
- `testRegisterVendorFailsForNonAdmin()` - Ensures admin-only registration
- `testVerifyVendor()` - Tests vendor verification process
- `testGetZoneVendors()` - Validates vendor listing functionality

#### 🎫 Voucher System Tests
- `testIssueVoucher()` - Tests voucher issuance with various parameters
- `testIssueVoucherFailsWithInsufficientFunding()` - Tests funding validation
- `testRedeemVoucher()` - Tests successful voucher redemption
- `testRedeemVoucherFailsForUnverifiedVendor()` - Ensures only verified vendors can redeem
- `testRedeemVoucherFailsWithInvalidCategory()` - Tests category restrictions
- `testRedeemVoucherFailsWhenExpired()` - Tests expiration validation

#### 🔐 Access Control Tests
- `testAddAndRemoveAdmin()` - Tests admin management
- `testTransferOwnership()` - Tests ownership transfer
- `testEmergencyFunctions()` - Tests pause/unpause and emergency withdrawal

#### 📊 Analytics & Reporting Tests
- `testGetUserVouchers()` - Tests voucher retrieval for users
- `testDisasterZoneStats()` - Validates statistical functions
- `testProofOfAidSubmission()` - Tests proof-of-aid functionality

---

## 🚀 Deployment Scripts

### DeployCompleteFixed.s.sol

**Purpose:** Automated deployment script for both contracts with test data creation.

#### 🔧 Deployment Process
1. **Contract Deployment:**
   - Deploys MockUSDC contract
   - Deploys DisasterReliefSystem contract
   - Sets up initial configurations

2. **Test Data Creation:**
   - Mints initial USDC to deployer
   - Creates sample disaster zone (Hurricane Sandy Relief Zone)
   - Sets up NYC coordinates (40.7128°N, 74.0060°W)
   - Adds 50km radius and 10,000 USDC funding

3. **Environment Setup:**
   - Generates contract addresses for frontend integration
   - Provides Snowtrace explorer links
   - Creates deployment summary with transaction hashes

#### 🎯 Usage
```bash
# Deploy to Fuji testnet
forge script script/DeployCompleteFixed.s.sol --rpc-url https://api.avax-test.network/ext/bc/C/rpc --broadcast

# Deploy with verification
forge script script/DeployCompleteFixed.s.sol --rpc-url https://api.avax-test.network/ext/bc/C/rpc --broadcast --verify
```

### Other Scripts
- `Deploy.s.sol` - Basic deployment script
- `DeployComplete.s.sol` - Previous version with environment variable requirements
- `Counter.s.sol` - Example/template script

---

## ⚙️ Configuration Files

### foundry.toml

**Foundry Configuration:**
- **Solidity Version:** 0.8.19
- **Optimizer:** Enabled with 200 runs
- **Gas Reports:** Enabled for all contracts
- **RPC Endpoints:** Fuji testnet and local network
- **Verification:** Snowtrace API integration

### .env.example

**Environment Variables Template:**
```bash
# Private key for deployment (optional)
PRIVATE_KEY=

# Snowtrace API key for contract verification
SNOWTRACE_API_KEY=

# Network configurations
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

---

## 🔧 Development Tools

### Foundry Framework Integration
- **Forge:** Compilation, testing, and deployment
- **Cast:** Blockchain interaction and debugging
- **Anvil:** Local blockchain for development

### External Dependencies
- **forge-std:** Standard library for testing and scripting
- **Solidity:** Version 0.8.19 for latest features and optimizations

---

## 🛡️ Security Features

### Access Control
- **Role-Based Permissions:** Owner, Admin, Vendor hierarchical structure
- **Multi-Signature Support:** Ready for multi-sig admin implementation
- **Emergency Functions:** Pause, unpause, and emergency withdrawal

### Data Validation
- **Coordinate Validation:** Ensures valid latitude/longitude ranges
- **Funding Validation:** Prevents overdrafts and invalid amounts
- **Category Restrictions:** Enforces voucher spending categories
- **Expiration Checks:** Validates voucher time limits

### Audit Trail
- **Comprehensive Events:** All major actions logged on-chain
- **IPFS Integration:** Immutable document storage
- **Transaction History:** Complete audit trail for transparency

---

## 📊 Gas Optimization

### Avalanche-Specific Optimizations
- **Batch Operations:** Efficient bulk voucher issuance
- **Storage Optimization:** Packed structs for reduced gas costs
- **Event Indexing:** Optimized for efficient querying

### Performance Metrics
- **Deployment Cost:** ~0.0018 ETH on Fuji testnet
- **Transaction Costs:** Optimized for Avalanche's low gas fees
- **Storage Efficiency:** Minimal storage footprint

---

## 🧪 Testing Guide

### Prerequisites
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install
```

### Running Tests
```bash
# Run all tests
forge test

# Run specific test
forge test --match-test testCreateDisasterZone

# Run tests with gas reporting
forge test --gas-report

# Run tests with verbose output
forge test -vvv
```

### Test Coverage
```bash
# Generate coverage report
forge coverage

# Generate detailed coverage report
forge coverage --report lcov
```

---

## 🚀 Deployment Guide

### Local Development
```bash
# Start local blockchain
anvil

# Deploy locally
forge script script/DeployCompleteFixed.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Fuji Testnet Deployment
```bash
# Set environment variables
export PRIVATE_KEY="your_private_key"
export SNOWTRACE_API_KEY="your_api_key"

# Deploy to Fuji
forge script script/DeployCompleteFixed.s.sol --rpc-url https://api.avax-test.network/ext/bc/C/rpc --broadcast --verify

# Or deploy without verification
SNOWTRACE_API_KEY="" forge script script/DeployCompleteFixed.s.sol --rpc-url https://api.avax-test.network/ext/bc/C/rpc --broadcast
```

### Production Deployment (Avalanche Mainnet)
```bash
# Update foundry.toml for mainnet
[rpc_endpoints]
mainnet = "https://api.avax.network/ext/bc/C/rpc"

# Deploy with verification
forge script script/DeployCompleteFixed.s.sol --rpc-url https://api.avax.network/ext/bc/C/rpc --broadcast --verify
```

---

## 📚 Integration Examples

### Frontend Integration
```javascript
// Contract interaction example
const contractService = new DisasterReliefContractService(provider, signer);
await contractService.initialize();

// Create disaster zone
await contractService.createDisasterZone(
  "Haiti Earthquake Relief",
  18.5392, -72.3350, // Port-au-Prince coordinates
  100, // 100km radius
  50000 // 50,000 USDC initial funding
);

// Register vendor
await contractService.registerVendor(
  vendorAddress,
  "Red Cross Haiti",
  "Port-au-Prince",
  zoneId,
  ipfsKycHash
);

// Issue voucher
await contractService.issueVoucher(
  beneficiaryAddress,
  500, // 500 USDC
  zoneId,
  ["food", "medical"], // allowed categories
  30 // expires in 30 days
);
```

### Backend Integration
```solidity
// Direct contract calls
DisasterReliefSystem relief = DisasterReliefSystem(contractAddress);

// Query disaster zones
DisasterReliefSystem.DisasterZone memory zone = relief.getDisasterZone(zoneId);

// Monitor events
relief.on("VoucherRedeemed", (voucherId, vendor, beneficiary, amount, category) => {
  // Handle voucher redemption event
});
```

---

## 🔍 Troubleshooting

### Common Issues

**Deployment Failures:**
- Ensure sufficient AVAX for gas fees
- Verify RPC URL connectivity
- Check private key format

**Test Failures:**
- Update Foundry to latest version
- Clear cache: `forge clean`
- Reinstall dependencies: `forge install --force`

**Contract Interaction Issues:**
- Verify contract addresses
- Check network configuration
- Ensure proper role permissions

### Debug Commands
```bash
# Check contract size
forge build --sizes

# Analyze gas usage
forge test --gas-report

# Debug specific transaction
cast tx <transaction_hash> --rpc-url <rpc_url>

# Check contract storage
cast storage <contract_address> <slot> --rpc-url <rpc_url>
```

---

## 📈 Future Enhancements

### Planned Features
- **Multi-token Support:** Support for multiple stablecoins
- **Advanced Analytics:** ML-powered fraud detection
- **Mobile Integration:** QR code voucher redemption
- **Government APIs:** Official disaster data integration
- **Cross-chain Support:** Ethereum and Polygon compatibility

### Upgrade Path
- **Proxy Pattern:** Implement upgradeable contracts
- **Modular Architecture:** Split into specialized contracts
- **Layer 2 Integration:** Avalanche subnet deployment

---

## 📞 Support & Resources

### Documentation
- [Foundry Book](https://book.getfoundry.sh/)
- [Avalanche Documentation](https://docs.avax.network/)
- [Solidity Documentation](https://docs.soliditylang.org/)

### Community
- [Avalanche Discord](https://discord.gg/RwXY7P6)
- [Foundry Telegram](https://t.me/foundry_rs)

### Project Links
- **Repository:** [GitHub](https://github.com/Aashik1701/Disaster_Relief_Microfunding_Network)
- **Frontend:** http://localhost:3000
- **Snowtrace:** [Contract Explorer](https://testnet.snowtrace.io/address/0x6a66fE30D16eceF92752A6C005f474b6125f847D)

---

**Smart Contracts Status: ✅ DEPLOYED & OPERATIONAL**  
**Last Updated:** December 2024  
**Version:** 2.0.0
