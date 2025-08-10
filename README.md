# 🚀 Avalanche Disaster Relief Network

A blockchain-powered disaster relief micro-funding network built on the Avalanche blockchain, enabling transparent and efficient aid distribution during emergencies.

## 🌟 Features

- **Smart Contract Integration**: Automated disaster relief bond issuance and management
- **Real-time Monitoring**: Live tracking of relief efforts and fund distribution
- **Multi-role Dashboard**: Separate interfaces for donors, victims, vendors, and government officials
- **IPFS Integration**: Decentralized storage for proof-of-aid documentation
- **Analytics & Transparency**: Comprehensive reporting and audit trails
- **Mobile-Responsive**: Works seamlessly across all devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Smart         │
│   (React/Vite)  │◄──►│   (Node.js/     │◄──►│   Contracts     │
│   Port: 3001    │    │   Express)      │    │   (Solidity)    │
│                 │    │   Port: 3000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IPFS Storage  │    │   PostgreSQL    │    │   Avalanche     │
│   (Pinata)      │    │   Database      │    │   Blockchain    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (for backend database)
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd Avalanche__Team1

# Run the integration setup (recommended)
npm run dev
```

This will:
- ✅ Install all dependencies
- ✅ Set up environment files
- ✅ Start both frontend and backend services
- ✅ Verify the integration

### 2. Access Your Application

Once setup completes:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 🛠️ Development

### Available Scripts

```bash
# Start all services
npm run dev
npm start

# Stop all services
npm run stop

# View logs
npm run logs

# Run integration tests
npm run test

# Install all dependencies
npm run install:all

# Build for production
npm run build
```

### Manual Setup

If you prefer manual setup:

```bash
# Backend
cd backend/api-server
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

## 📁 Project Structure

```
Avalanche__Team1/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and blockchain services
│   │   └── contexts/       # React contexts
│   └── package.json
├── backend/
│   └── api-server/         # Node.js/Express API server
│       ├── src/
│       │   ├── routes/     # API route handlers
│       │   ├── models/     # Database models
│       │   ├── controllers/# Business logic
│       │   └── services/   # External service integrations
│       └── package.json
├── contracts/              # Solidity smart contracts
│   └── disaster-relief-contracts/
├── scripts/               # Integration and utility scripts
├── docs/                  # Documentation
└── package.json          # Root package.json with scripts
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/disaster_relief_db
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3001
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_AVALANCHE_CHAIN_ID=43113
```

## 🧪 Testing

```bash
# Run all integration tests
npm run test

# Test specific components
npm run test:health    # Health endpoints
npm run test:api       # API endpoints
npm run test:frontend  # Frontend connectivity
```

## 📚 Documentation

- [Integration Guide](./INTEGRATION_GUIDE.md) - Detailed setup and integration instructions
- [API Documentation](./backend/api-server/README.md) - Backend API reference
- [Smart Contracts](./contracts/README.md) - Smart contract documentation
- [Frontend Guide](./frontend/README.md) - Frontend component guide

## 🔌 API Integration

The frontend communicates with the backend through a comprehensive API service:

```javascript
import apiService from './services/apiService';

// Get disaster zones
const disasters = await apiService.getDisasterZones();

// Create new disaster zone
const newDisaster = await apiService.createDisasterZone({
  name: 'Hurricane Relief',
  location: 'Florida, USA',
  description: 'Emergency response for hurricane victims'
});
```

### Key API Endpoints

- `GET /api/disasters` - Get all disaster zones
- `POST /api/disasters` - Create new disaster zone
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Register new vendor
- `GET /api/transactions` - Get all transactions
- `POST /api/auth/wallet` - Authenticate with wallet

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Start backend in production
cd backend/api-server
NODE_ENV=production npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](./INTEGRATION_GUIDE.md#troubleshooting)
2. Review the logs: `npm run logs`
3. Run tests: `npm run test`
4. Check GitHub issues for known problems

## 🙏 Acknowledgments

- Avalanche Foundation for blockchain infrastructure
- OpenZeppelin for smart contract security
- React and Vite communities for frontend tooling
- Express.js community for backend framework

---

**Built with ❤️ for disaster relief and humanitarian aid**
