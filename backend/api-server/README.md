# 🏥 Disaster Relief Backend API Server

A comprehensive Node.js backend API server for the Avalanche Disaster Relief Microfunding Network, providing secure, scalable endpoints for managing disaster relief operations, voucher systems, and proof of aid verification.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL or SQLite
- Redis (optional, for caching)

### Installation & Setup

```bash
# Clone and navigate to the API server
cd backend/api-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database (auto-setup)
npm run db:setup:auto

# Start the development server
npm run dev
```

The server will start on `http://localhost:5001` (or your configured PORT).

## 📊 API Architecture

### Core Components

- **🗄️ Database Layer**: Sequelize ORM with PostgreSQL/SQLite
- **🔐 Authentication**: JWT-based with role-based access control (RBAC)
- **⚡ Caching**: Redis integration for performance optimization
- **📝 Validation**: Express-validator for input sanitization
- **🔍 Audit Trail**: Comprehensive action logging system
- **🌐 CORS**: Configured for cross-origin requests

### Database Schema (14 Tables)

```
├── users              # User accounts and profiles
├── disasters          # Disaster zone declarations
├── vendors            # Verified aid vendors
├── vouchers           # Relief vouchers for beneficiaries
├── transactions       # Voucher redemption records
├── proof_of_aid       # Aid delivery verification
├── notifications      # System notifications
├── api_keys           # API access management
├── job_queue          # Background job processing
├── sessions           # User session management
├── cache              # Application-level caching
├── audit_logs         # System action audit trail
├── analytics_cache    # Performance analytics storage
└── system_settings    # Dynamic configuration
```

## 🔐 Authentication & Authorization

### User Roles & Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | Full system access | System administrators |
| **Government** | Disaster management, vendor approval | Government officials |
| **Treasury** | Financial oversight, fund allocation | Financial controllers |
| **Oracle** | Data verification, proof validation | Data validators |
| **Vendor** | Voucher redemption, proof submission | Aid providers |
| **Victim** | Voucher claiming, aid requests | Disaster victims |
| **Donor** | Donation tracking, impact viewing | Charitable donors |

### Authentication Methods

```bash
# JWT Token Authentication
Authorization: Bearer <jwt_token>

# Development Mode (bypasses auth)
X-Dev-Mode: true
X-Dev-Role: admin

# Wallet Signature Authentication (Web3)
POST /api/auth/wallet-login
```

## 📡 API Endpoints

### 📊 Analytics & Dashboard

```bash
# Role-specific dashboard data
GET    /api/analytics/dashboard

# Funding statistics (global/zone-specific)
GET    /api/analytics/funding?zoneId=123

# Geographic aid distribution
GET    /api/analytics/geographic

# Impact metrics and ROI
GET    /api/analytics/impact/:zoneId?

# User statistics by role (admin only)
GET    /api/analytics/users/roles
```

### 🎫 Voucher Management

```bash
# List all vouchers (filtered)
GET    /api/vouchers?status=active&page=1&limit=10

# Get voucher details
GET    /api/vouchers/:id

# Issue new voucher (admin/government)
POST   /api/vouchers
{
  "beneficiary": "0x1234...",
  "disasterZoneId": 1,
  "amount": 100,
  "allowedCategories": ["food", "medical"],
  "expiryTime": "2025-12-31T23:59:59Z"
}

# Redeem voucher (vendor only)
POST   /api/vouchers/:id/redeem
{
  "amount": 50,
  "category": "food",
  "ipfsProofHash": "QmX1Y2Z3...",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "description": "Emergency food supplies"
}

# Validate voucher (vendor pre-check)
GET    /api/vouchers/:id/validate

# Get user's vouchers
GET    /api/vouchers/user/:walletAddress?status=active

# Zone voucher statistics
GET    /api/vouchers/zone/:zoneId/stats
```

### 📋 Proof of Aid

```bash
# Submit proof of aid delivery
POST   /api/proofs
{
  "transactionId": "tx123",
  "category": "food",
  "description": "Delivered 50 meals to affected families",
  "items": [
    {"item": "Rice", "quantity": 25, "unit": "kg"},
    {"item": "Water", "quantity": 100, "unit": "bottles"}
  ],
  "location": {"lat": 37.7749, "lng": -122.4194}
}

# List all proofs (with filters)
GET    /api/proofs?vendorAddress=0x1234&category=food&page=1

# Get proof details
GET    /api/proofs/:id

# Verify proof (admin/oracle only)
PATCH  /api/proofs/:id/verify
{
  "verified": true,
  "verificationNotes": "Proof verified successfully",
  "verifierComments": "All documentation complete"
}

# Get proofs for transaction
GET    /api/proofs/transaction/:transactionId

# Get proofs for voucher
GET    /api/proofs/voucher/:voucherId

# Vendor's proof submissions
GET    /api/proofs/vendor/:walletAddress

# Proof statistics and analytics
GET    /api/proofs/stats?period=week&category=food
```

### 🌪️ Disaster Management

```bash
# List disaster zones
GET    /api/disasters?status=active&page=1

# Get disaster details
GET    /api/disasters/:id

# Create disaster zone (admin only)
POST   /api/disasters
{
  "name": "Hurricane Relief 2025",
  "latitude": 25.7617,
  "longitude": -80.1918,
  "radius": 50000,
  "initialFunding": 1000000
}

# Update disaster status
PATCH  /api/disasters/:id/status
{
  "status": "active"
}

# Disaster statistics
GET    /api/disasters/:id/stats

# Disaster transactions
GET    /api/disasters/:id/transactions
```

### 🏢 Vendor Management

```bash
# List vendors
GET    /api/vendors?disasterZoneId=1

# Get vendor details
GET    /api/vendors/:walletAddress

# Register vendor (admin only)
POST   /api/vendors
{
  "walletAddress": "0x1234...",
  "name": "Local Food Bank",
  "location": "Miami, FL",
  "disasterZoneId": 1,
  "kycIpfsHash": "QmKYC123..."
}

# Update vendor status
PATCH  /api/vendors/:address/status
{
  "status": "verified"
}

# Vendor transactions
GET    /api/vendors/:address/transactions
```

### 💸 Transaction Management

```bash
# List transactions
GET    /api/transactions?vendorAddress=0x1234&page=1

# Get transaction details
GET    /api/transactions/:hash

# Transaction proof details
GET    /api/transactions/:hash/proof
```

### 👥 User Management

```bash
# List users (admin only)
GET    /api/users?role=vendor&status=active&page=1

# Get user details
GET    /api/users/:id

# Get user by wallet
GET    /api/users/wallet/:walletAddress

# Create user (admin only)
POST   /api/users
{
  "walletAddress": "0x1234...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "vendor"
}

# Update user
PUT    /api/users/:id
{
  "name": "Jane Doe",
  "status": "active"
}

# Current user profile
GET    /api/users/profile
PUT    /api/users/profile

# User statistics
GET    /api/users/stats

# User audit history
GET    /api/users/:id/audit
```

### 🔐 Authentication

```bash
# Traditional login
POST   /api/auth/login
{
  "email": "admin@relief.network",
  "password": "secure_password"
}

# Wallet authentication (Web3)
POST   /api/auth/wallet-login
{
  "walletAddress": "0x1234...",
  "signature": "0xabcd..."
}

# Refresh token
POST   /api/auth/refresh
{
  "refreshToken": "refresh_token_here"
}

# Logout
POST   /api/auth/logout

# Verify token
GET    /api/auth/verify

# Role-specific dashboards
GET    /api/auth/dashboard

# Demo login (development only)
POST   /api/auth/demo-login/:role
```

### 🔔 Notifications

```bash
# Send email notification (admin only)
POST   /api/notifications/email
{
  "to": "user@example.com",
  "subject": "Relief Update",
  "message": "Your voucher is ready"
}

# Send SMS notification (admin only)
POST   /api/notifications/sms
{
  "to": "+1234567890",
  "message": "Emergency alert: New disaster zone declared"
}

# Get notification logs (admin only)
GET    /api/notifications/logs?page=1&limit=10
```

### 📝 Audit & Compliance

```bash
# Get audit logs (admin/treasury only)
GET    /api/audit?userId=123&action=CREATE&page=1

# User audit history
GET    /api/audit/user/:userId?limit=100

# Resource audit history
GET    /api/audit/resource/:resource/:resourceId

# Audit statistics
GET    /api/audit/stats?period=week&days=7

# Manual audit entry (admin only)
POST   /api/audit
{
  "action": "MANUAL_VERIFICATION",
  "resource": "vendor",
  "resourceId": "123",
  "description": "Manual verification completed"
}
```

### ⚙️ System Settings

```bash
# Get all settings (admin only)
GET    /api/settings?category=email

# Get specific setting
GET    /api/settings/:key?defaultValue=fallback

# Update setting (admin only)
PATCH  /api/settings/:key
{
  "value": "new_value",
  "description": "Updated configuration"
}
```

### 📎 File Upload (IPFS)

```bash
# Upload file to IPFS
POST   /api/ipfs/upload
Content-Type: multipart/form-data
# File attached as 'file' field

Response:
{
  "success": true,
  "data": {
    "hash": "QmX1Y2Z3...",
    "size": 1024,
    "url": "https://gateway.pinata.cloud/ipfs/QmX1Y2Z3..."
  }
}
```

## 🛠️ Database Operations

### CLI Commands

```bash
# Database initialization
npm run db:init           # Full setup (migrate + seed)
npm run db:setup          # Interactive setup
npm run db:setup:auto     # Automated setup

# Migration management
npm run db:migrate        # Run pending migrations
npm run db:rollback       # Rollback last migration
npm run db:status         # Check migration status

# Data seeding
npm run db:seed           # Run all seeders

# Database maintenance
npm run db:reset          # ⚠️ Reset entire database
npm run db:health         # Health check
npm run db:cleanup        # Clean expired cache

# User & API key management
npm run db:user           # Create admin user
npm run db:apikey         # Generate API key
```

### Manual Database Operations

```javascript
// Using the DatabaseManager directly
const DatabaseManager = require('./src/database/manager');
const manager = new DatabaseManager();

// Initialize database
await manager.initialize();

// Run migrations
await manager.runMigrations();

// Seed data
await manager.runSeeders();
```

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/disaster_relief
DB_DIALECT=postgres  # or 'sqlite'

# Redis Cache (optional)
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your_super_secure_jwt_secret_here

# Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Service (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# File Upload (Pinata IPFS)
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret
VITE_PINATA_JWT=your_pinata_jwt

# Blockchain (Avalanche)
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_wallet_private_key
DISASTER_RELIEF_CONTRACT=0x...

# Development Settings
DISABLE_JWT_AUTH=true     # Bypass auth in development
DEFAULT_DEV_ROLE=admin    # Default role for dev mode
LOG_LEVEL=debug
```

### Production Configuration

```bash
# Use production environment template
cp .env.production.example .env

# Required production settings
NODE_ENV=production
DISABLE_JWT_AUTH=false
DATABASE_URL=postgresql://prod_user:secure_pass@db_host:5432/relief_prod
REDIS_URL=redis://cache_host:6379
```

## 🧪 Testing & Development

### Health Check

```bash
# Server health endpoint
curl http://localhost:5001/health

Response:
{
  "status": "OK",
  "timestamp": "2025-08-16T07:59:27.298Z",
  "uptime": 103.544736875,
  "database": "healthy",
  "cache": "connected"
}
```

### Development Mode

```bash
# Enable development mode in .env
NODE_ENV=development
DISABLE_JWT_AUTH=true
DEFAULT_DEV_ROLE=admin

# Test endpoints without authentication
curl -H "X-Dev-Mode: true" -H "X-Dev-Role: admin" \
     http://localhost:5001/api/analytics/dashboard
```

### API Testing Examples

```bash
# Test analytics dashboard
curl -X GET "http://localhost:5001/api/analytics/dashboard" \
     -H "Content-Type: application/json" \
     -H "X-Dev-Mode: true" \
     -H "X-Dev-Role: admin"

# Test voucher creation
curl -X POST "http://localhost:5001/api/vouchers" \
     -H "Content-Type: application/json" \
     -H "X-Dev-Mode: true" \
     -H "X-Dev-Role: admin" \
     -d '{
       "beneficiary": "0x742d35Cc6e3A597E7CDD03C3a93B4c4c9b5c5D4E",
       "disasterZoneId": 1,
       "amount": 100,
       "allowedCategories": ["food", "medical"],
       "expiryTime": "2025-12-31T23:59:59Z"
     }'

# Test proof submission
curl -X POST "http://localhost:5001/api/proofs" \
     -H "Content-Type: application/json" \
     -H "X-Dev-Mode: true" \
     -H "X-Dev-Role: vendor" \
     -d '{
       "transactionId": "tx123",
       "category": "food",
       "description": "Delivered emergency food supplies",
       "items": [{"item": "Rice", "quantity": 25, "unit": "kg"}]
     }'
```

## 📊 Performance & Monitoring

### Caching Strategy

- **Redis Cache**: Used for frequently accessed data
- **Database Indexes**: Optimized queries on all major tables
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Includes/joins minimized for performance

### Monitoring Endpoints

```bash
# Database health
GET /health

# Database CLI status
npm run db:health

# Cache performance
GET /api/analytics/dashboard  # Includes cache hit rates
```

### Performance Optimizations

- **Pagination**: All list endpoints support pagination
- **Caching**: 5-30 minute cache TTLs based on data volatility
- **Indexes**: Proper database indexing on foreign keys and search fields
- **Connection Pooling**: Configured for high concurrency
- **Query Optimization**: Efficient ORM queries with minimal N+1 problems

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission system
- **Input Validation**: Express-validator on all endpoints
- **SQL Injection Protection**: Sequelize ORM parameterized queries

### Security Headers
- **CORS**: Configured cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Rate Limiting**: Request rate limiting per IP
- **Input Sanitization**: XSS and injection prevention

### Audit & Compliance
- **Complete Audit Trail**: All actions logged with user, timestamp, and changes
- **Data Integrity**: Database constraints and validation
- **Privacy Protection**: Sensitive data excluded from responses
- **GDPR Compliance**: User data management and deletion capabilities

## 📁 Project Structure

```
backend/api-server/
├── src/
│   ├── controllers/          # Business logic controllers
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── disasterController.js
│   │   ├── proofController.js
│   │   ├── transactionController.js
│   │   ├── userController.js
│   │   ├── vendorController.js
│   │   └── voucherController.js
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # Authentication & authorization
│   │   ├── errorHandler.js  # Error handling
│   │   └── validation.js    # Input validation
│   ├── models/              # Database models (14 models)
│   │   ├── index.js         # Model associations
│   │   ├── User.js
│   │   ├── Disaster.js
│   │   ├── Vendor.js
│   │   ├── Voucher.js
│   │   ├── Transaction.js
│   │   ├── ProofOfAid.js
│   │   └── ...
│   ├── routes/              # API route definitions
│   │   ├── analytics.js     # Analytics endpoints
│   │   ├── auth.js          # Authentication
│   │   ├── disasters.js     # Disaster management
│   │   ├── proofs.js        # Proof of aid
│   │   ├── transactions.js  # Transaction management
│   │   ├── users.js         # User management
│   │   ├── vendors.js       # Vendor management
│   │   └── vouchers.js      # Voucher management
│   ├── services/            # Business logic services
│   │   ├── dataService.js   # Database operations
│   │   ├── cacheService.js  # Redis caching
│   │   ├── blockchainService.js  # Smart contract integration
│   │   └── notificationService.js  # Email/SMS notifications
│   ├── database/            # Database management
│   │   ├── manager.js       # Database manager
│   │   ├── connection.js    # Database connection
│   │   ├── db-cli.js        # CLI tool
│   │   ├── migrations/      # 14 migration files
│   │   └── seeders/         # 5 seeder files
│   └── utils/               # Utility functions
├── server.js                # Main server entry point
├── package.json             # Node.js dependencies
├── .env.example            # Environment template
├── .env.production.example # Production config template
└── README.md               # This documentation
```

## 🚀 Deployment

### Local Development

```bash
# Install and start
npm install
npm run db:setup:auto
npm run dev
```

### Production Deployment

```bash
# Production build
NODE_ENV=production npm install --production

# Database setup
npm run db:migrate
npm run db:seed

# Start production server
NODE_ENV=production npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

### Environment-Specific Deployment

```bash
# Development
npm run dev

# Staging
NODE_ENV=staging npm start

# Production
NODE_ENV=production npm start
```

## 🤝 Contributing

### Development Workflow

1. **Setup Development Environment**
   ```bash
   git clone <repository>
   cd backend/api-server
   npm install
   cp .env.example .env
   npm run db:setup:auto
   ```

2. **Database Changes**
   ```bash
   # Create new migration
   npx sequelize-cli migration:generate --name add-new-feature
   
   # Create new model
   npx sequelize-cli model:generate --name NewModel --attributes field:type
   
   # Run migrations
   npm run db:migrate
   ```

3. **API Development**
   - Add controllers in `src/controllers/`
   - Define routes in `src/routes/`
   - Add validation in `src/middleware/validation.js`
   - Update `server.js` to include new routes

4. **Testing**
   ```bash
   # Health check
   curl http://localhost:5001/health
   
   # Test endpoints
   npm run test
   ```

### Code Standards

- **ESLint**: Follow established linting rules
- **Error Handling**: Use try-catch with proper error responses
- **Validation**: Validate all inputs with express-validator
- **Security**: Follow OWASP security guidelines
- **Documentation**: Document all new endpoints in this README

## 📞 Support & Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check database status
   npm run db:health
   
   # Reset database
   npm run db:reset  # ⚠️ Destructive
   ```

2. **Authentication Issues**
   ```bash
   # Enable development mode
   DISABLE_JWT_AUTH=true in .env
   
   # Test with headers
   curl -H "X-Dev-Mode: true" -H "X-Dev-Role: admin" <endpoint>
   ```

3. **Performance Issues**
   ```bash
   # Check cache status
   curl http://localhost:5001/health
   
   # Clear cache
   npm run db:cleanup
   ```

### Logging

```bash
# Set log level in .env
LOG_LEVEL=debug  # debug, info, warn, error

# View logs
tail -f server.log

# Database logs
npm run db:status
```

### API Documentation

For detailed API documentation and interactive testing, the server provides:
- Health endpoint: `GET /health`
- OpenAPI documentation: Available via code inspection
- Postman collection: Import endpoints for testing

---

## 📜 License

This project is part of the Avalanche Disaster Relief Microfunding Network.

---

**🏥 Disaster Relief Backend API - Production Ready v2.0.0**

*Built with ❤️ for humanitarian aid and disaster relief operations.*
