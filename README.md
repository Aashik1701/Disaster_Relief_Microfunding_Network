# 🏔️ Avalanche Disaster Relief Network

<div align="center">

**A Blockchain-Powered Micro-Funding Network for Disaster Relief**

[![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb)](https://reactjs.org/)
[![Powered by Vite](https://img.shields.io/badge/Powered%20by-Vite-646cff)](https://vitejs.dev/)
[![Avalanche](https://img.shields.io/badge/Blockchain-Avalanche-e84142)](https://www.avax.network/)
[![IPFS](https://img.shields.io/badge/Storage-IPFS%20Pinata-65c2cb)](https://pinata.cloud/)

*Transparent, efficient, and geo-locked disaster relief funding through blockchain technology*

</div>

---

## 🎯 Project Overview

The Avalanche Disaster Relief Network revolutionizes disaster relief funding using blockchain technology. This project leverages Avalanche's high-performance network to create a transparent, efficient, and accountable micro-funding system.

### 🌟 Key Features

- **🔒 Geo-Locked Spending**: Funds restricted to designated disaster zones
- **🏪 Vendor Verification**: KYC-verified vendors for secure transactions
- **📱 Responsive Design**: Mobile-first web application
- **🌐 IPFS Storage**: Decentralized proof-of-aid via Pinata
- **💰 USDC Payments**: Stable cryptocurrency with minimal fees
- **📊 Real-Time Monitoring**: Live transaction tracking
- **🔍 Transparency Portal**: Public donation and spending visibility

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React + Vite + Tailwind CSS + PWA
- **Blockchain**: Avalanche Fuji Testnet + Solidity Smart Contracts
- **Storage**: Pinata IPFS for proof-of-aid
- **Backend**: Node.js + Express + Real-time monitoring
- **Payments**: USDC integration

### 🔗 Deployed Contracts (Avalanche Fuji Testnet)
```
DisasterReliefSystem: 0x6a66fE30D16eceF92752A6C005f474b6125f847D
MockUSDC:            0xcB238E70da4Bf99b0c0e77c7f871c22b46e0980A
Fuji USDC:           0x5425890298aed601595a70AB815c96711a31Bc65
```

---

## 🚀 Quick Start

### Prerequisites
```bash
node --version  # Requires Node.js 18+
git --version
```

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/avalanche-disaster-relief.git
cd avalanche-disaster-relief
npm install
```

### 2. Environment Setup
```bash
# Copy environment templates
cp frontend/.env.example frontend/.env
cp backend/api-server/.env.example backend/api-server/.env

# Update with your configuration
```

### 3. Start Development
```bash
# Install all dependencies
npm run install:all

# Start all services
npm run dev:all
```

### 4. Access Applications
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **Monitoring**: http://localhost:3003

---

## 🏪 Smart Contract Features

### Core Functionality
- **Disaster Zone Management**: Create and manage geo-locked relief zones
- **Vendor System**: KYC verification and payment processing
- **Voucher Distribution**: USDC-based voucher allocation to victims
- **Proof of Aid**: IPFS-stored evidence of aid delivery
- **Analytics**: Real-time funding and distribution tracking

### Security Features
- **Multi-signature controls** for admin functions
- **Geo-location verification** for fund usage
- **Rate limiting** on voucher creation
- **Automated fraud detection**

---

## 📱 User Interfaces

### 🎯 Admin Dashboard
- Create and manage disaster zones
- Verify and approve vendors
- Monitor real-time transactions
- Generate impact reports

### 💝 Donor Portal
- Easy donation interface
- Real-time impact tracking
- Transparency reports
- Tax receipt generation

### 🛍️ Vendor Interface
- Payment processing system
- Inventory management
- Transaction history
- Proof submission

### 👥 Victim Portal
- Voucher balance checking
- QR code for payments
- Aid history tracking

---

## 🌐 API Endpoints

### Disaster Management
```javascript
POST   /api/disasters              // Create disaster zone
GET    /api/disasters/:id          // Get disaster details
PUT    /api/disasters/:id          // Update disaster zone
```

### Vendor Operations
```javascript
POST   /api/vendors/register       // Vendor registration
POST   /api/vendors/verify         // KYC verification
GET    /api/vendors/:id/payments   // Payment history
```

### IPFS Integration
```javascript
POST   /api/ipfs/upload           // Upload proof of aid
GET    /api/ipfs/:hash            // Retrieve file by hash
```

---

## 🧪 Testing

### Smart Contracts
```bash
cd contracts/disaster-relief-contracts
forge test                    # Run all tests
forge test --gas-report      # Gas analysis
forge coverage               # Coverage report
```

### Frontend
```bash
cd frontend
npm run test                 # Unit tests
npm run test:e2e            # Integration tests
```

### Backend
```bash
cd backend/api-server
npm run test                # API tests
npm run test:load          # Load testing
```

---

## 🚀 Deployment

### Local Development
```bash
npm run dev:full
```

### Testnet Deployment
```bash
npm run deploy:testnet
```

### Production Deployment
```bash
npm run deploy:mainnet
```

---

## 📊 Project Status

### ✅ Completed Features
- [x] Smart contract architecture with geo-locking
- [x] Responsive web application with PWA capabilities
- [x] IPFS integration with Pinata
- [x] Real-time monitoring and analytics
- [x] Admin dashboard and vendor management
- [x] Multi-wallet support (MetaMask, Core)

### 🔄 Future Enhancements
- [ ] Custom Avalanche subnet deployment
- [ ] Cross-chain bridge integration
- [ ] Advanced fraud detection with ML
- [ ] Mobile native applications
- [ ] Multi-language support

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **Solhint** for Solidity linting

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 📞 Support & Contact

### Demo Links
- **Live Demo**: [avalanche-disaster-relief.vercel.app](https://avalanche-disaster-relief.vercel.app)
- **Smart Contracts**: [Snowtrace Explorer](https://testnet.snowtrace.io/)

### Documentation
- **Technical Docs**: Available in `/docs` directory
- **API Reference**: Available at `/backend/api-server/docs`

---

<div align="center">

**Built with ❤️ for the Avalanche community**

*Transforming disaster relief through blockchain innovation*

</div>
