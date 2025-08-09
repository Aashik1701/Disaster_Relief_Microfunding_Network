# 🚀 Smart Contracts - Disaster Relief Network

## 📋 Overview

Smart contracts for the Avalanche Disaster Relief Network providing transparent, geo-locked disaster relief funding with vendor verification and voucher distribution.

---

## 🔗 Deployed Contracts (Avalanche Fuji Testnet)

```
DisasterReliefSystem: 0x6a66fE30D16eceF92752A6C005f474b6125f847D
MockUSDC:            0xcB238E70da4Bf99b0c0e77c7f871c22b46e0980A
Fuji USDC:           0x5425890298aed601595a70AB815c96711a31Bc65

Network: Avalanche Fuji Testnet (Chain ID: 43113)
RPC URL: https://api.avax-test.network/ext/bc/C/rpc
Explorer: https://testnet.snowtrace.io/
```

---

## 📄 Smart Contracts

### DisasterReliefSystem.sol
Main contract managing disaster relief operations.

**Key Features:**
- Geo-locked disaster zone creation and management
- Vendor KYC verification system
- USDC voucher distribution to victims
- IPFS proof-of-aid storage integration
- Real-time analytics and reporting

**Core Functions:**
```solidity
function createDisasterZone(...)        // Admin creates disaster zone
function addVendor(...)                // Admin adds KYC-verified vendor
function distributeVouchers(...)       // Distribute USDC vouchers to victims
function redeemVoucher(...)            // Vendor processes victim payment
function submitProofOfAid(...)         // Submit IPFS proof of aid delivery
```

### MockUSDC.sol
ERC20 token contract for testing USDC functionality.

**Features:**
- Standard ERC20 implementation
- Minting capabilities for testing
- 6 decimal precision (matching real USDC)

---

## 🧪 Testing

### Run Tests
```bash
cd contracts/disaster-relief-contracts
forge test                    # Run all tests
forge test -vvv              # Verbose output
forge test --gas-report      # Gas usage analysis
```

### Test Coverage
```bash
forge coverage               # Generate coverage report
```

### Test Results
- **Total Tests**: 22 passing
- **Coverage**: 95%+ of contract functionality
- **Gas Optimization**: Efficient implementation

---

## 🚀 Deployment

### Local Development
```bash
# Start local Anvil node
anvil

# Deploy contracts locally
forge script script/DeployCompleteFixed.s.sol --fork-url http://localhost:8545 --broadcast
```

### Fuji Testnet Deployment
```bash
# Deploy to Fuji testnet
forge script script/DeployCompleteFixed.s.sol \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --broadcast \
  --verify
```

---

## ⚙️ Configuration

### Environment Variables (.env)
```bash
# Deployment
PRIVATE_KEY=your_private_key_here

# Verification
SNOWTRACE_API_KEY=your_api_key_here

# Network URLs
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

### Foundry Configuration (foundry.toml)
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.19"
optimizer = true
optimizer_runs = 200
gas_reports = ["*"]

[rpc_endpoints]
fuji = "https://api.avax-test.network/ext/bc/C/rpc"
```

---

## 🛡️ Security Features

- **Multi-signature controls** for admin functions
- **Geo-location verification** using Chainlink oracles
- **Rate limiting** on voucher creation
- **Emergency pause functionality**
- **Comprehensive access controls**

---

## 📊 Gas Optimization

- **Optimized storage patterns** minimize gas costs
- **Batch operations** for efficient multi-user actions
- **Event-driven architecture** for off-chain indexing
- **Minimal external calls** reduce transaction costs

---

## 🔧 Development Tools

### Required Tools
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install
```

### Useful Commands
```bash
forge build                  # Compile contracts
forge test                   # Run tests
forge fmt                    # Format code
forge snapshot              # Gas snapshots
cast --help                 # CLI blockchain interactions
```

---

## 📚 Integration Examples

### Frontend Integration
```javascript
import { ethers } from 'ethers';
import DisasterReliefABI from './DisasterReliefSystem.json';

const contract = new ethers.Contract(
  '0x6a66fE30D16eceF92752A6C005f474b6125f847D',
  DisasterReliefABI,
  provider
);

// Create disaster zone
await contract.createDisasterZone(
  "Hurricane Relief Zone",
  latitude,
  longitude,
  radiusKm,
  fundingAmount
);
```

### Backend Integration
```javascript
// Monitor contract events
contract.on('DisasterZoneCreated', (zoneId, name, funding) => {
  console.log(`New disaster zone: ${name} with ${funding} USDC`);
});
```

---

## 📞 Support

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues
- **Testnet Explorer**: [Snowtrace](https://testnet.snowtrace.io/)
- **Avalanche Docs**: [Official Documentation](https://docs.avax.network/)

---

*Built with Foundry for the Avalanche ecosystem*
