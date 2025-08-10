# 🏔️ **Complete Project Guide - Avalanche Disaster Relief Network**

<div align="center">

**📚 Comprehensive Development & Deployment Guide**

[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/Aashik1701/Disaster_Relief_Microfunding_Network)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)](http://localhost:3000)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*Everything you need to know to run, develop, and deploy the Avalanche Disaster Relief Network*

</div>

---

## 📁 **Project Architecture Overview**

```
Avalanche__Team1/
├── 🎨 frontend/                    # React + Vite Frontend Application
│   ├── public/                     # Static assets & PWA manifest
│   ├── src/                        # Source code
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Charts/             # Data visualization components
│   │   │   ├── DisasterRelief/     # Relief-specific components
│   │   │   ├── Layout/             # Navigation & layout components
│   │   │   ├── UI/                 # Generic UI components
│   │   │   └── Web3/               # Blockchain integration components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Route components
│   │   ├── services/               # API & blockchain services
│   │   ├── store/                  # State management (Zustand)
│   │   └── utils/                  # Helper functions & constants
│   ├── package.json                # Dependencies & scripts
│   ├── vite.config.js              # Vite configuration
│   └── tailwind.config.js          # TailwindCSS configuration
│
├── 🔧 backend/                     # Node.js Backend Services
│   ├── api-server/                 # Main REST API Server
│   │   ├── src/                    # Source code
│   │   │   ├── controllers/        # Request handlers
│   │   │   ├── database/           # Database connection & migrations
│   │   │   ├── middleware/         # Authentication & validation
│   │   │   ├── models/             # Database models (Sequelize)
│   │   │   ├── routes/             # API route definitions
│   │   │   ├── services/           # Business logic services
│   │   │   └── utils/              # Helper functions & constants
│   │   ├── package.json            # Dependencies & scripts
│   │   └── server.js               # Main application entry point
│   │
│   ├── monitoring-service/         # Blockchain Event Monitoring
│   │   ├── src/                    # Source code
│   │   │   ├── analyzers/          # Fraud detection & analytics
│   │   │   └── listeners/          # Smart contract event listeners
│   │   ├── package.json            # Dependencies & scripts
│   │   └── monitor.js              # Main monitoring entry point
│   │
│   └── scripts/                    # Development & deployment scripts
│       ├── setup.sh                # Project setup automation
│       ├── dev.sh                  # Development environment
│       └── build.sh                # Production build
│
├── ⛓️ contracts/                   # Solidity Smart Contracts
│   └── disaster-relief-contracts/  # Foundry project
│       ├── src/                    # Smart contract source code
│       │   ├── DisasterReliefSystem.sol       # Main relief operations
│       │   ├── DisasterReliefBondsV2.sol      # Pre-funded relief bonds
│       │   └── MockUSDC.sol                   # Test USDC token
│       ├── script/                 # Deployment scripts
│       ├── test/                   # Contract tests
│       ├── foundry.toml            # Foundry configuration
│       └── README.md               # Contract-specific documentation
│
├── 📚 lib/                        # External dependencies
│   └── forge-std/                  # Foundry standard library
│
├── 📖 README.md                   # Main project documentation
└── 📋 Project_Guide.md            # This comprehensive guide
```

---

## 🚀 **Quick Start Guide**

### **Prerequisites Checklist**

Before starting, ensure you have the following installed:

```bash
# Required Software
✅ Node.js >= 18.0.0     # JavaScript runtime
✅ npm >= 8.0.0          # Package manager
✅ Git >= 2.30.0         # Version control
✅ PostgreSQL >= 13      # Database for backend
✅ Redis >= 6.0          # Caching & session storage

# Optional but Recommended
⭐ Docker & Docker Compose   # Containerization
⭐ Foundry                   # Smart contract development
⭐ VS Code                   # IDE with extensions
⭐ MetaMask                  # Web3 wallet for testing
```

### **Installation Commands**

```bash
# macOS (using Homebrew)
brew install node postgresql redis git
brew install --cask docker

# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm postgresql redis git docker.io

# Install Foundry (for smart contracts)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

---

## 🎨 **Frontend Application (React + Vite)**

**Location**: `/frontend/`  
**Technology Stack**: React 18.2.0, Vite 7.1.1, TailwindCSS, Ethers.js

### **🚀 Getting Started**

```bash
# Navigate to frontend directory
cd frontend/

# Install all dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
# ✅ Application runs at: http://localhost:3000
```

### **📋 Available Scripts**

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run lint             # Run ESLint for code quality

# Environment Management
npm run clean            # Clean build artifacts
npm run analyze          # Bundle size analysis
```

### **🔧 Environment Configuration**

Create `/frontend/.env` with the following variables:

```bash
# Smart Contract Configuration
VITE_CONTRACT_ADDRESS=0x6a66fE30D16eceF92752A6C005f474b6125f847D
VITE_BONDS_CONTRACT_ADDRESS=0x1234...  # DisasterReliefBondsV2 address
VITE_USDC_ADDRESS=0x5425890298aed601595a70AB815c96711a31Bc65

# Network Configuration
VITE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_CHAIN_ID=43113
VITE_NETWORK_NAME=Avalanche Fuji Testnet

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000

# External Services
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_ANALYTICS_ID=your-analytics-id

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

### **🛡️ RBAC System Implementation**

The frontend implements a sophisticated 7-tier role-based access control system:

#### **Role Hierarchy & Access Levels**

```javascript
// Role hierarchy with access levels
const ROLES = {
  ADMIN: { level: 10, label: 'Administrator' },
  GOVERNMENT: { level: 8, label: 'Government Official' },
  TREASURY: { level: 7, label: 'Treasury Manager' },
  ORACLE: { level: 6, label: 'Data Oracle' },
  VENDOR: { level: 5, label: 'Relief Vendor' },
  VICTIM: { level: 4, label: 'Relief Recipient' },
  DONOR: { level: 3, label: 'Donor/Supporter' }
}
```

#### **Dynamic Role Detection**

```javascript
// Automatic role detection based on blockchain state
const determineUserRole = async (account, contractService) => {
  // 1. Check admin role via contract
  const hasAdminRole = await contract.hasRole(ADMIN_ROLE, account)
  if (hasAdminRole) return 'admin'

  // 2. Check vendor registration
  const vendor = await contractService.getVendor(account)
  if (vendor && vendor.address !== ethers.ZeroAddress) return 'vendor'

  // 3. Check active vouchers (victim)
  const vouchers = await contractService.getUserVouchers(account)
  const activeVouchers = vouchers.filter(v => !v.used && v.expiryTime > new Date())
  if (activeVouchers.length > 0) return 'victim'

  // 4. Default to donor
  return 'donor'
}
```

#### **Component-Level Access Control**

```jsx
// Role-based component rendering
const AdminDashboard = () => {
  const { userRole } = useWeb3Store()
  
  if (userRole !== 'admin') {
    return <AccessDenied requiredRole="admin" />
  }
  
  return (
    <div className="admin-dashboard">
      {/* Admin-only content */}
    </div>
  )
}

// Conditional feature access
{userRole === 'admin' && (
  <Button onClick={createDisasterZone}>
    Create New Disaster Zone
  </Button>
)}
```

### **📱 User Interfaces by Role**

#### **👑 Admin Dashboard**
- **Full System Control**: Create/manage disaster zones
- **Vendor Management**: Register and verify vendors
- **Financial Controls**: Fund allocation and tracking
- **Analytics & Reporting**: System-wide metrics
- **Emergency Functions**: System pause and recovery

#### **🏛️ Government Portal**
- **Disaster Approval**: Verify and approve emergency events
- **Bulk Payouts**: Mass distribution to pre-verified citizens
- **Victim Verification**: Approve self-registered victims
- **Reporting**: Government-level impact metrics

#### **💰 Treasury Management**
- **Yield Generation**: Manage investment strategies
- **Fund Optimization**: Monitor and optimize returns
- **Liquidity Management**: Ensure emergency fund availability

#### **🔮 Oracle Interface**
- **Disaster Reporting**: Submit disaster events and data
- **Data Feeds**: Provide external verification data
- **Monitoring**: Track disaster severity and impact

#### **🏪 Vendor Portal**
- **Payment Processing**: Accept and process voucher payments
- **Transaction History**: View personal transaction records
- **Proof Submission**: Upload aid distribution evidence
- **Profile Management**: Update vendor information

#### **🎯 Victim Portal**
- **Voucher Management**: View and use relief vouchers
- **Self-Registration**: Register for disaster relief
- **Transaction History**: Track relief fund usage
- **Status Updates**: Receive relief status notifications

#### **💝 Donor Dashboard**
- **Donation Interface**: Contribute funds to disaster zones
- **Impact Tracking**: View donation outcomes and transparency
- **Bond Management**: Corporate ESG bond investments
- **Analytics**: Personal contribution impact metrics

### **🔗 Key Features**

- **⚡ Real-time Updates**: WebSocket connections for live data
- **📱 Mobile-First Design**: Touch-friendly responsive interface
- **🔐 Web3 Integration**: MetaMask and wallet connectivity
- **🎨 Professional UI/UX**: Modern, accessible interface design
- **🚀 PWA Support**: Offline functionality and app-like experience

---

## 🔧 **Backend API Server (Node.js + Express)**

**Location**: `/backend/api-server/`  
**Technology Stack**: Node.js, Express, PostgreSQL, Redis, Sequelize ORM

### **🚀 Getting Started**

```bash
# Navigate to API server directory
cd backend/api-server/

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up database
npm run migrate
npm run seed

# Start development server
npm run dev
# ✅ API server runs at: http://localhost:5000
```

### **📋 Available Scripts**

```bash
# Development
npm run dev              # Start with nodemon (auto-restart)
npm start                # Start production server
npm run migrate          # Run database migrations
npm run seed             # Seed initial data

# Testing
npm test                 # Run test suite
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Database Management
npm run db:reset         # Reset database
npm run db:backup        # Backup database
npm run db:restore       # Restore from backup
```

### **🔧 Environment Configuration**

Create `/backend/api-server/.env` with the following variables:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/disaster_relief
DB_HOST=localhost
DB_PORT=5432
DB_NAME=disaster_relief
DB_USER=your_username
DB_PASS=your_password

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Blockchain Configuration
PRIVATE_KEY=your-wallet-private-key-for-contract-interaction
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0x6a66fE30D16eceF92752A6C005f474b6125f847D
BONDS_CONTRACT_ADDRESS=0x1234...
USDC_ADDRESS=0x5425890298aed601595a70AB815c96711a31Bc65

# IPFS Configuration
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET=your-pinata-secret-key
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACf43d14fc97aa9e5e9b539a416ed6ec24
TWILIO_AUTH_TOKEN=3e50414b75c4d6d7504ccd499b62a275
TWILIO_PHONE_NUMBER=+916383877110 # Your Twilio phone number

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security & Rate Limiting
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Logging & Monitoring
LOG_LEVEL=info
LOG_FILE=./logs/app.log
ENABLE_MORGAN=true
```

### **🛡️ API Security & RBAC**

#### **Authentication Middleware**

```javascript
// JWT token verification
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await dataService.getUserById(decoded.id)
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

#### **Role-Based Access Control**

```javascript
// Admin-only endpoint protection
const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required',
        requiredRole: 'admin',
        userRole: req.user.role
      })
    }
    next()
  })
}

// Vendor-only endpoint protection
const requireVendor = async (req, res, next) => {
  await requireAuth(req, res, () => {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ 
        error: 'Vendor access required',
        requiredRole: 'vendor',
        userRole: req.user.role
      })
    }
    next()
  })
}
```

### **📡 API Endpoints Documentation**

#### **Authentication Endpoints**

```bash
POST /api/auth/register          # User registration
POST /api/auth/login             # User login
POST /api/auth/logout            # User logout
POST /api/auth/refresh           # Refresh JWT token
POST /api/auth/forgot-password   # Password reset request
POST /api/auth/reset-password    # Password reset confirmation
GET  /api/auth/profile           # Get user profile
PUT  /api/auth/profile           # Update user profile
```

#### **Disaster Management Endpoints**

```bash
GET    /api/disasters                    # List all disasters
POST   /api/disasters                    # Create disaster (Admin)
GET    /api/disasters/:id                # Get disaster details
PUT    /api/disasters/:id                # Update disaster (Admin)
DELETE /api/disasters/:id                # Delete disaster (Admin)
POST   /api/disasters/:id/approve        # Approve disaster (Government)
GET    /api/disasters/:id/analytics      # Disaster analytics
```

#### **Vendor Management Endpoints**

```bash
GET    /api/vendors                      # List all vendors
POST   /api/vendors                      # Register vendor (Admin)
GET    /api/vendors/:id                  # Get vendor details
PUT    /api/vendors/:id                  # Update vendor (Admin)
DELETE /api/vendors/:id                  # Remove vendor (Admin)
POST   /api/vendors/:id/verify           # Verify vendor (Admin)
GET    /api/vendors/:id/transactions     # Vendor transaction history
```

#### **Transaction Processing Endpoints**

```bash
GET    /api/transactions                 # List transactions
POST   /api/transactions                 # Process transaction (Vendor)
GET    /api/transactions/:id             # Get transaction details
PUT    /api/transactions/:id/confirm     # Confirm transaction
GET    /api/transactions/analytics       # Transaction analytics
```

#### **IPFS & File Management Endpoints**

```bash
POST   /api/ipfs/upload                  # Upload file to IPFS
GET    /api/ipfs/:hash                   # Get file from IPFS
POST   /api/ipfs/proof-of-aid           # Submit proof of aid
GET    /api/ipfs/proof-of-aid/:id       # Get proof of aid
```

#### **Analytics & Reporting Endpoints**

```bash
GET    /api/analytics/overview           # System overview metrics
GET    /api/analytics/donations          # Donation analytics
GET    /api/analytics/distributions      # Distribution analytics
GET    /api/analytics/impact             # Impact metrics
GET    /api/analytics/performance        # Performance metrics
```

### **🗃️ Database Schema**

#### **Core Tables**

```sql
-- Users table with RBAC
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'donor',
  profile JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disasters table
CREATE TABLE disasters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  status VARCHAR(20) DEFAULT 'active',
  funding_goal DECIMAL(18, 6),
  funding_raised DECIMAL(18, 6) DEFAULT 0,
  government_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  disaster_zone_id INTEGER REFERENCES disasters(id),
  verified BOOLEAN DEFAULT false,
  kyc_hash VARCHAR(255),
  reputation_score DECIMAL(3, 2) DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  victim_address VARCHAR(42) NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  tx_hash VARCHAR(66),
  proof_of_aid_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📊 **Monitoring Service**

**Location**: `/backend/monitoring-service/`  
**Technology Stack**: Node.js, Ethers.js, WebSocket

### **🚀 Getting Started**

```bash
# Navigate to monitoring service
cd backend/monitoring-service/

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start monitoring service
npm start
# ✅ Monitoring blockchain events in real-time
```

### **🔧 Environment Configuration**

```bash
# Blockchain Configuration
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0x6a66fE30D16eceF92752A6C005f474b6125f847D
BONDS_CONTRACT_ADDRESS=0x1234...

# Monitoring Configuration
POLL_INTERVAL=5000                    # Block polling interval (ms)
BATCH_SIZE=100                        # Events per batch
RETRY_ATTEMPTS=3                      # Failed request retries

# WebSocket Configuration
WS_PORT=8080                          # WebSocket server port
WS_HEARTBEAT_INTERVAL=30000          # Heartbeat interval (ms)

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/disaster_relief

# Fraud Detection
FRAUD_DETECTION_ENABLED=true
MAX_TRANSACTION_AMOUNT=10000         # USD
VELOCITY_THRESHOLD=5                 # Transactions per minute
```

### **🔍 Event Monitoring Features**

```javascript
// Contract event listeners
const contractEventListener = {
  // Disaster zone events
  DisasterZoneCreated: (event) => {
    console.log(`New disaster zone: ${event.args.name}`)
    broadcastToClients('disaster-created', event.args)
  },
  
  // Voucher distribution events
  VoucherIssued: (event) => {
    console.log(`Voucher issued: ${event.args.amount} USDC`)
    updateVoucherMetrics(event.args)
  },
  
  // Transaction events
  PaymentProcessed: (event) => {
    console.log(`Payment processed: ${event.args.amount}`)
    analyzeFraudRisk(event.args)
    broadcastToClients('payment-processed', event.args)
  }
}
```

### **🚨 Fraud Detection System**

```javascript
// Transaction pattern analysis
const fraudDetection = {
  analyzeTransaction: (transaction) => {
    const riskScore = calculateRiskScore(transaction)
    
    if (riskScore > FRAUD_THRESHOLD) {
      flagSuspiciousActivity(transaction)
      notifyAdministrators(transaction)
    }
    
    return riskScore
  },
  
  calculateRiskScore: (transaction) => {
    let score = 0
    
    // Velocity check
    if (getTransactionVelocity(transaction.vendor) > VELOCITY_THRESHOLD) {
      score += 30
    }
    
    // Amount check
    if (transaction.amount > MAX_TRANSACTION_AMOUNT) {
      score += 50
    }
    
    // Geographic check
    if (!isWithinDisasterZone(transaction.location)) {
      score += 40
    }
    
    return score
  }
}
```

---

## ⛓️ **Smart Contracts (Foundry)**

**Location**: `/contracts/disaster-relief-contracts/`  
**Technology Stack**: Solidity 0.8.19, Foundry, OpenZeppelin

### **🚀 Getting Started**

```bash
# Navigate to contracts directory
cd contracts/disaster-relief-contracts/

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test
```

### **📋 Available Commands**

```bash
# Development
forge build                          # Compile contracts
forge test                           # Run test suite
forge test -vvv                      # Verbose test output
forge test --gas-report              # Gas usage analysis
forge coverage                       # Test coverage report

# Local Development
anvil                                # Start local blockchain
forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast

# Testnet Deployment
forge script script/DeployCompleteFixed.s.sol \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --broadcast \
  --verify

# Mainnet Deployment
forge script script/DeployCompleteFixed.s.sol \
  --rpc-url https://api.avax.network/ext/bc/C/rpc \
  --broadcast \
  --verify

# Utility Commands
forge fmt                            # Format code
forge snapshot                       # Gas snapshots
cast --help                          # CLI blockchain interactions
```

### **🔧 Environment Configuration**

Create `/contracts/disaster-relief-contracts/.env`:

```bash
# Deployment Configuration
PRIVATE_KEY=your-deployer-private-key
DEPLOYER_ADDRESS=0x1234...

# Network Configuration
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
MAINNET_RPC_URL=https://api.avax.network/ext/bc/C/rpc
LOCAL_RPC_URL=http://localhost:8545

# Verification
SNOWTRACE_API_KEY=your-snowtrace-api-key

# Contract Addresses (after deployment)
DISASTER_RELIEF_SYSTEM=0x6a66fE30D16eceF92752A6C005f474b6125f847D
DISASTER_RELIEF_BONDS_V2=0x1234...
MOCK_USDC=0xcB238E70da4Bf99b0c0e77c7f871c22b46e0980A
FUJI_USDC=0x5425890298aed601595a70AB815c96711a31Bc65
```

### **📄 Smart Contract Overview**

#### **1. DisasterReliefSystem.sol**
**Main contract for disaster relief operations**

```solidity
// Key features
- Geo-locked disaster zone creation
- Vendor KYC verification system
- USDC voucher distribution
- IPFS proof-of-aid integration
- Real-time analytics

// Core functions
function createDisasterZone(...)      // Admin creates disaster zone
function addVendor(...)               // Admin adds verified vendor
function distributeVouchers(...)      // Distribute USDC vouchers
function redeemVoucher(...)           // Vendor processes payment
function submitProofOfAid(...)        // Upload proof of aid
```

#### **2. DisasterReliefBondsV2.sol**
**Advanced pre-funded relief bonds with yield generation**

```solidity
// Revolutionary features
- Corporate ESG bond investments
- Automated yield generation (3-5% APY)
- Emergency bulk government payouts
- Victim self-registration system
- Multi-payment method support (crypto, bank, mobile money)

// Key functions
function issueBond(...)               // Create relief bond
function reportDisaster(...)          // Oracle reports disaster
function executeBulkPayout(...)       // Government mass distribution
function generateYield(...)           // Treasury yield generation
function redeemBond(...)              // Donor withdraws with yield
```

#### **3. MockUSDC.sol**
**Test USDC token for development**

```solidity
// Testing features
- Standard ERC20 implementation
- Minting capabilities for testing
- 6 decimal precision (matching real USDC)
- Faucet functionality for developers
```

### **🧪 Testing Framework**

```bash
# Test structure
test/
├── DisasterReliefSystem.t.sol       # Main contract tests
├── DisasterReliefBondsV2.t.sol      # Bonds contract tests
├── MockUSDC.t.sol                   # Token tests
└── Integration.t.sol                # Integration tests

# Test coverage areas
✅ Admin role management
✅ Disaster zone creation
✅ Vendor registration & verification
✅ Voucher distribution & redemption
✅ Bond issuance & maturity
✅ Emergency payout scenarios
✅ Yield generation mechanisms
✅ Security & access controls
✅ Edge cases & error handling
```

### **🚀 Deployment Guide**

#### **Local Development**

```bash
# Terminal 1: Start local blockchain
anvil

# Terminal 2: Deploy contracts
forge script script/DeployCompleteFixed.s.sol \
  --fork-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

#### **Fuji Testnet Deployment**

```bash
# Deploy with verification
forge script script/DeployCompleteFixed.s.sol \
  --rpc-url $FUJI_RPC_URL \
  --broadcast \
  --verify \
  --private-key $PRIVATE_KEY

# Verify contracts manually (if needed)
forge verify-contract \
  --chain-id 43113 \
  --num-of-optimizations 200 \
  --watch \
  --compiler-version v0.8.19+commit.7dd6d404 \
  --etherscan-api-key $SNOWTRACE_API_KEY \
  $CONTRACT_ADDRESS \
  src/DisasterReliefSystem.sol:DisasterReliefSystem
```

#### **Mainnet Deployment**

```bash
# Deploy to Avalanche Mainnet
forge script script/DeployCompleteFixed.s.sol \
  --rpc-url $MAINNET_RPC_URL \
  --broadcast \
  --verify \
  --private-key $PRIVATE_KEY \
  --slow
```

### **⛽ Gas Optimization**

```solidity
// Optimized storage patterns
struct OptimizedStruct {
    uint128 amount;          // Pack into single slot
    uint64 timestamp;        // Pack with amount
    uint32 id;              // Pack with timestamp
    bool active;            // Pack with id
}

// Batch operations for efficiency
function batchProcessVouchers(
    address[] calldata recipients,
    uint256[] calldata amounts
) external {
    for (uint i = 0; i < recipients.length; i++) {
        _processVoucher(recipients[i], amounts[i]);
    }
}
```

---

## 🛠️ **Development Scripts**

**Location**: `/backend/scripts/`

### **🚀 Automated Setup**

```bash
#!/bin/bash
# setup.sh - Complete project setup

echo "🏔️ Setting up Avalanche Disaster Relief Network..."

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend && npm install && cd ..
cd backend/api-server && npm install && cd ../..
cd backend/monitoring-service && npm install && cd ../..

# Set up environment files
echo "🔧 Setting up environment files..."
cp frontend/.env.example frontend/.env
cp backend/api-server/.env.example backend/api-server/.env
cp backend/monitoring-service/.env.example backend/monitoring-service/.env

# Set up database
echo "🗃️ Setting up database..."
cd backend/api-server
npm run migrate
npm run seed
cd ../..

# Build contracts
echo "⛓️ Building smart contracts..."
cd contracts/disaster-relief-contracts
forge build
cd ../..

echo "✅ Setup complete! Run './scripts/dev.sh' to start development environment."
```

### **🔄 Development Environment**

```bash
#!/bin/bash
# dev.sh - Start complete development environment

echo "🚀 Starting Avalanche Disaster Relief Network development environment..."

# Start services in background
echo "📊 Starting monitoring service..."
cd backend/monitoring-service && npm start &
MONITOR_PID=$!

echo "🔧 Starting API server..."
cd ../api-server && npm run dev &
API_PID=$!

echo "🎨 Starting frontend..."
cd ../../frontend && npm run dev &
FRONTEND_PID=$!

# Trap to kill all processes on script exit
trap "kill $MONITOR_PID $API_PID $FRONTEND_PID" EXIT

echo "✅ All services started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:5000"
echo "📊 Monitoring: WebSocket on port 8080"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes
wait
```

### **🏗️ Production Build**

```bash
#!/bin/bash
# build.sh - Build for production

echo "🏗️ Building Avalanche Disaster Relief Network for production..."

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm run build
cd ..

# Build API server (if using TypeScript)
echo "🔧 Building API server..."
cd backend/api-server
npm run build
cd ../..

# Build contracts
echo "⛓️ Building smart contracts..."
cd contracts/disaster-relief-contracts
forge build
cd ../..

echo "✅ Production build complete!"
echo "📦 Frontend build: frontend/dist/"
echo "📦 API build: backend/api-server/dist/"
echo "📦 Contracts build: contracts/disaster-relief-contracts/out/"
```

---

## 🚀 **Production Deployment**

### **🌐 Frontend Deployment (Vercel/Netlify)**

#### **Vercel Deployment**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend/
vercel

# Configure environment variables in Vercel dashboard
VITE_CONTRACT_ADDRESS=0x6a66fE30D16eceF92752A6C005f474b6125f847D
VITE_API_BASE_URL=https://your-api.herokuapp.com/api
# ... other environment variables
```

#### **Netlify Deployment**

```bash
# Build and deploy
cd frontend/
npm run build

# Deploy to Netlify (or use Netlify CLI)
netlify deploy --prod --dir=dist
```

### **🔧 Backend Deployment (Railway/Heroku)**

#### **Railway Deployment**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up

# Configure environment variables in Railway dashboard
```

#### **Heroku Deployment**

```bash
# Install Heroku CLI and deploy
heroku login
heroku create your-app-name
git push heroku main

# Configure environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=your-secret
# ... other environment variables
```

### **⛓️ Smart Contract Deployment (Avalanche Mainnet)**

```bash
# Deploy to Avalanche Mainnet
cd contracts/disaster-relief-contracts/

# Deploy with verification
forge script script/DeployCompleteFixed.s.sol \
  --rpc-url https://api.avax.network/ext/bc/C/rpc \
  --broadcast \
  --verify \
  --private-key $PRIVATE_KEY

# Update frontend and backend with new addresses
```

---

## 📊 **Monitoring & Analytics**

### **🔍 Application Monitoring**

```bash
# Health check endpoints
GET /api/health                      # API health status
GET /api/health/database             # Database connectivity
GET /api/health/blockchain           # Blockchain connectivity
GET /api/health/services             # External services status

# Metrics endpoints
GET /api/metrics/overview            # System overview
GET /api/metrics/performance         # Performance metrics
GET /api/metrics/errors              # Error tracking
GET /api/metrics/usage               # Usage analytics
```

### **📈 Business Intelligence**

```bash
# Analytics dashboards
GET /api/analytics/donations         # Donation trends
GET /api/analytics/distributions     # Distribution patterns
GET /api/analytics/impact            # Impact measurements
GET /api/analytics/efficiency        # Operational efficiency
GET /api/analytics/fraud             # Fraud detection metrics
```

### **🚨 Error Tracking & Logging**

```javascript
// Winston logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})
```

---

## 🔐 **Security Best Practices**

### **🛡️ Smart Contract Security**

```solidity
// Security modifiers and checks
modifier onlyAdmin() {
    require(admins[msg.sender], "Not an admin");
    _;
}

modifier validAmount(uint256 amount) {
    require(amount > 0, "Amount must be positive");
    require(amount <= MAX_AMOUNT, "Amount exceeds maximum");
    _;
}

modifier nonReentrant() {
    require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
}
```

### **🔒 API Security**

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// Input validation
const { body, validationResult } = require('express-validator')

const validateDisaster = [
  body('name').isLength({ min: 1, max: 255 }).escape(),
  body('location').isLength({ min: 1, max: 255 }).escape(),
  body('severity').isInt({ min: 1, max: 10 }),
  body('funding_goal').isFloat({ min: 0 })
]
```

### **🔐 Frontend Security**

```javascript
// Content Security Policy
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "wss:", "https:"]
  }
}

// Input sanitization
import DOMPurify from 'dompurify'

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input)
}
```

---

## 🐛 **Troubleshooting Guide**

### **❌ Common Issues & Solutions**

#### **Frontend Issues**

```bash
# Issue: MetaMask connection problems
# Solution: Check network configuration
if (window.ethereum) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xA869' }], // Fuji testnet
  })
}

# Issue: Build errors
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Issue: Environment variables not loading
# Solution: Check .env file format (no spaces around =)
VITE_CONTRACT_ADDRESS=0x1234...  # Correct
VITE_CONTRACT_ADDRESS = 0x1234...  # Incorrect
```

#### **Backend Issues**

```bash
# Issue: Database connection failed
# Solution: Check PostgreSQL service and credentials
pg_isready -h localhost -p 5432

# Issue: Redis connection failed
# Solution: Check Redis service
redis-cli ping

# Issue: JWT token invalid
# Solution: Check JWT_SECRET in environment
echo $JWT_SECRET
```

#### **Smart Contract Issues**

```bash
# Issue: Deployment failed
# Solution: Check gas price and balance
cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL

# Issue: Contract verification failed
# Solution: Manual verification
forge verify-contract $CONTRACT_ADDRESS src/Contract.sol:Contract --chain-id 43113

# Issue: Transaction reverted
# Solution: Check contract state and permissions
cast call $CONTRACT_ADDRESS "admins(address)(bool)" $YOUR_ADDRESS --rpc-url $RPC_URL
```

### **🔍 Debugging Tools**

```bash
# Frontend debugging
npm run dev -- --debug           # Debug mode
console.log(error.message)       # Error logging

# Backend debugging
DEBUG=* npm run dev              # Debug all modules
node --inspect server.js         # Node.js debugger

# Smart contract debugging
forge test -vvv                  # Verbose output
forge debug                     # Interactive debugger
```

---

## 📚 **Additional Resources**

### **📖 Documentation Links**

- **[Avalanche Documentation](https://docs.avax.network/)** - Official Avalanche docs
- **[Foundry Book](https://book.getfoundry.sh/)** - Smart contract development
- **[React Documentation](https://reactjs.org/docs)** - Frontend framework
- **[Express.js Guide](https://expressjs.com/en/guide/)** - Backend framework
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling framework

### **🛠️ Development Tools**

- **[Remix IDE](https://remix.ethereum.org/)** - Online Solidity IDE
- **[Etherscan](https://etherscan.io/)** - Ethereum blockchain explorer
- **[Snowtrace](https://snowtrace.io/)** - Avalanche blockchain explorer
- **[MetaMask](https://metamask.io/)** - Web3 wallet
- **[Postman](https://www.postman.com/)** - API testing

### **🎓 Learning Resources**

- **[Solidity by Example](https://solidity-by-example.org/)** - Smart contract examples
- **[React Tutorial](https://reactjs.org/tutorial/tutorial.html)** - React basics
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)** - Backend development
- **[Web3 Development](https://ethereum.org/en/developers/)** - Blockchain development

---

## 🤝 **Contributing**

### **💻 Development Setup**

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/Disaster_Relief_Microfunding_Network.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push and create pull request
git push origin feature/your-feature-name
```

### **📝 Code Standards**

```bash
# Frontend
npm run lint                      # ESLint checks
npm run format                    # Prettier formatting

# Backend
npm run lint                      # ESLint checks
npm test                          # Run tests

# Smart Contracts
forge fmt                         # Format Solidity code
forge test                        # Run contract tests
```

---

## 📞 **Support & Contact**

### **🆘 Getting Help**

- **📧 Email**: support@disaster-relief-network.com
- **💬 Discord**: [Community Server](https://discord.gg/avalanche)
- **🐛 Issues**: [GitHub Issues](https://github.com/Aashik1701/Disaster_Relief_Microfunding_Network/issues)
- **📖 Documentation**: [Project Wiki](https://github.com/Aashik1701/Disaster_Relief_Microfunding_Network/wiki)

### **🌐 Community**

- **🐦 Twitter**: [@AvalancheDisasterRelief](https://twitter.com/avalanche)
- **📺 YouTube**: [Development Tutorials](https://youtube.com/avalanche)
- **📰 Blog**: [Medium Publication](https://medium.com/@avalanche)

---

<div align="center">

**🏔️ Avalanche Disaster Relief Network**

*Revolutionizing disaster relief through blockchain technology*

[![GitHub Stars](https://img.shields.io/github/stars/Aashik1701/Disaster_Relief_Microfunding_Network?style=social)](https://github.com/Aashik1701/Disaster_Relief_Microfunding_Network)
[![Follow on Twitter](https://img.shields.io/twitter/follow/avalanche?style=social)](https://twitter.com/avalanche)

---

**Built with ❤️ by the Avalanche Community**

*Last Updated: August 10, 2025*

</div>
