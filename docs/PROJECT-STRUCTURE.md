# 📁 Project Structure

## Root Directory
```
Avalanche__Team1/
├── README.md                    # Main project documentation
├── package.json                # Root package configuration
├── backend/                     # Backend services
├── contracts/                   # Smart contracts
├── docs/                        # Documentation
└── frontend/                    # React web application
```

## Backend Structure
```
backend/
├── api-server/                 # Main API server
│   ├── src/                    # Source code
│   │   ├── controllers/        # API controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Data models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   └── utils/              # Utility functions
│   ├── package.json           # API server dependencies
│   └── server.js              # Server entry point
├── monitoring-service/         # Real-time monitoring
└── scripts/                   # Build and deployment scripts
```

## Frontend Structure
```
frontend/
├── src/
│   ├── components/            # React components
│   │   ├── Charts/           # Data visualization
│   │   ├── DisasterRelief/   # Domain components
│   │   ├── Layout/           # Layout components
│   │   ├── UI/               # Reusable UI components
│   │   └── Web3/             # Blockchain components
│   ├── contracts/            # Contract ABIs and addresses
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── services/             # API and blockchain services
│   ├── store/                # State management
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── package.json             # Frontend dependencies
└── vite.config.js           # Vite configuration
```

## Smart Contracts Structure
```
contracts/
├── README.md                 # Contract documentation
└── disaster-relief-contracts/
    ├── src/                  # Solidity contracts
    │   ├── DisasterReliefSystem.sol
    │   ├── DisasterReliefBondsV2.sol
    │   └── MockUSDC.sol
    ├── script/               # Deployment scripts
    ├── test/                 # Contract tests
    ├── foundry.toml         # Foundry configuration
    └── .env.example         # Environment template
```

## Documentation
```
docs/
└── PHASE-2-COMPLETE.md      # Implementation summary
```

## Key Files

### Configuration Files
- `package.json` - Root dependencies and scripts
- `frontend/vite.config.js` - Vite build configuration
- `contracts/foundry.toml` - Foundry/Forge configuration
- `.env.example` files - Environment variable templates

### Entry Points
- `frontend/src/main.jsx` - Frontend application entry
- `backend/api-server/server.js` - Backend API server
- `backend/monitoring-service/monitor.js` - Monitoring service

### Smart Contracts
- `DisasterReliefSystem.sol` - Main relief management contract
- `MockUSDC.sol` - Test USDC token contract
- `DisasterReliefBondsV2.sol` - Bond management system

---

*This structure supports a clean separation of concerns with scalable architecture for the disaster relief platform.*
