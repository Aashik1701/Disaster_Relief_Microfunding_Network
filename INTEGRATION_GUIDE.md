# 🚀 Frontend-Backend Integration Guide

This guide provides comprehensive instructions for integrating and running the Avalanche Disaster Relief Network frontend and backend services.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
- [Environment Configuration](#environment-configuration)
- [API Integration](#api-integration)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## 🔧 Prerequisites

Before starting the integration, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL** (for backend database) - [Download here](https://www.postgresql.org/)
- **Redis** (optional, for caching) - [Download here](https://redis.io/)

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version

# Check Git version
git --version
```

## ⚡ Quick Start

The fastest way to get both services running:

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd Avalanche__Team1

# Run the integration setup script
./scripts/integration-setup.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Set up environment files
- ✅ Install dependencies
- ✅ Start both services
- ✅ Verify services are running

### Access Your Application

Once the script completes successfully:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Stop Services

```bash
./scripts/stop-services.sh
```

### View Logs

```bash
# View all logs
./scripts/view-logs.sh

# View specific service logs
./scripts/view-logs.sh backend
./scripts/view-logs.sh frontend

# Check service status
./scripts/view-logs.sh status
```

## 🔧 Manual Setup

If you prefer to set up services manually or need to troubleshoot:

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend/api-server

# Install dependencies
npm install

# Create environment file
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## ⚙️ Environment Configuration

### Backend Environment (.env)

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=disaster_relief_db
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/disaster_relief_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# Blockchain Configuration
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43113
CONTRACT_ADDRESS=your_contract_address_here
```

### Frontend Environment (.env)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Blockchain Configuration
VITE_AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_AVALANCHE_CHAIN_ID=43113
VITE_CONTRACT_ADDRESS=your_contract_address_here

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_DEV_MODE=true
```

## 🔌 API Integration

The frontend is configured to communicate with the backend through the API service located at `frontend/src/services/apiService.js`.

### Key Integration Points

1. **Base URL Configuration**: Set in `VITE_API_BASE_URL`
2. **CORS Configuration**: Backend allows requests from `FRONTEND_URL`
3. **Authentication**: JWT tokens handled automatically
4. **Error Handling**: Comprehensive error handling with retry logic
5. **Offline Support**: Requests queued when offline

### API Endpoints

The backend provides the following API endpoints:

#### Disaster Management
- `GET /api/disasters` - Get all disaster zones
- `POST /api/disasters` - Create new disaster zone
- `GET /api/disasters/:id` - Get disaster zone details
- `PATCH /api/disasters/:id/status` - Update disaster status

#### Vendor Management
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Register new vendor
- `GET /api/vendors/:address` - Get vendor details
- `POST /api/vendors/:address/verify` - Verify vendor

#### Transaction Management
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Record new transaction
- `GET /api/transactions/:hash` - Get transaction details

#### Authentication
- `POST /api/auth/wallet` - Authenticate with wallet
- `POST /api/auth/refresh` - Refresh token
- `GET /api/users/:address` - Get user profile

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/funding` - Funding statistics
- `GET /api/analytics/geographic` - Geographic distribution

### Using the API Service

```javascript
import apiService from '../services/apiService';

// Get disaster zones
const disasters = await apiService.getDisasterZones();

// Create new disaster zone
const newDisaster = await apiService.createDisasterZone({
  name: 'Hurricane Relief',
  location: 'Florida, USA',
  description: 'Emergency response for hurricane victims'
});

// Get vendor details
const vendor = await apiService.getVendor('0x123...');
```

## 🔄 Development Workflow

### Recommended Development Process

1. **Start Services**: Use the integration script
2. **Backend Development**: 
   - Modify API endpoints in `backend/api-server/src/routes/`
   - Update models in `backend/api-server/src/models/`
   - Test with Postman or curl
3. **Frontend Development**:
   - Modify components in `frontend/src/components/`
   - Update pages in `frontend/src/pages/`
   - Test API integration
4. **Database Changes**:
   - Update models and run migrations
   - Seed test data if needed

### Hot Reload

Both services support hot reload during development:
- **Backend**: Uses nodemon for automatic restarts
- **Frontend**: Uses Vite for fast HMR (Hot Module Replacement)

### Testing API Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test disaster zones endpoint
curl http://localhost:3000/api/disasters

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/users/0x123...
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Kill processes using the port
kill -9 $(lsof -ti :3000)
kill -9 $(lsof -ti :3001)
```

#### 2. Database Connection Issues

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if needed
brew services start postgresql

# Create database
createdb disaster_relief_db
```

#### 3. CORS Issues

Ensure the backend `.env` has the correct frontend URL:
```bash
FRONTEND_URL=http://localhost:3001
```

#### 4. Environment Variables Not Loading

```bash
# Check if .env files exist
ls -la backend/api-server/.env
ls -la frontend/.env

# Verify environment variables are loaded
echo $VITE_API_BASE_URL
```

#### 5. Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable debug logging:

```bash
# Backend
NODE_ENV=development DEBUG=* npm run dev

# Frontend
VITE_ENABLE_DEBUG_LOGGING=true npm run dev
```

### Log Analysis

```bash
# View real-time logs
./scripts/view-logs.sh

# Check specific service
./scripts/view-logs.sh backend
./scripts/view-logs.sh frontend
```

## 🚀 Production Deployment

### Environment Setup

1. **Backend Production**:
   ```bash
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=your_production_db_url
   JWT_SECRET=your_secure_jwt_secret
   FRONTEND_URL=https://your-domain.com
   ```

2. **Frontend Production**:
   ```bash
   VITE_API_BASE_URL=https://api.your-domain.com/api
   VITE_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
   VITE_AVALANCHE_CHAIN_ID=43114
   ```

### Build Commands

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend/api-server
NODE_ENV=production npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual containers
docker build -t disaster-relief-backend ./backend/api-server
docker build -t disaster-relief-frontend ./frontend
```

## 📚 Additional Resources

- [Backend API Documentation](./backend/api-server/README.md)
- [Frontend Component Guide](./frontend/README.md)
- [Database Schema](./backend/api-server/src/database/init.sql)
- [Smart Contract Integration](./contracts/README.md)

## 🤝 Contributing

When contributing to the integration:

1. Follow the existing code structure
2. Update environment examples when adding new variables
3. Test both frontend and backend changes
4. Update this guide for any new integration points
5. Ensure CORS and security configurations are maintained

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs using `./scripts/view-logs.sh`
3. Verify environment configurations
4. Test API endpoints individually
5. Check the GitHub issues for known problems

---

**Happy Coding! 🎉** 