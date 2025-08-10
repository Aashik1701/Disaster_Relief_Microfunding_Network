const { ethers } = require('ethers');

// Blockchain interaction service
class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize provider for Avalanche Fuji Testnet
      this.provider = new ethers.JsonRpcProvider(
        process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
      );

      // Initialize contracts (if needed)
      this.initializeContracts();
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
    }
  }

  initializeContracts() {
    // Contract addresses from frontend
    const contracts = {
      disasterRelief: process.env.DISASTER_RELIEF_CONTRACT || '0x6a66fE30D16eceF92752A6C005f474b6125f847D',
      mockUSDC: process.env.MOCK_USDC_CONTRACT || '0xcB238E70da4Bf99b0c0e77c7f871c22b46e0980A',
      fujiUSDC: process.env.FUJI_USDC_CONTRACT || '0x5425890298aed601595a70AB815c96711a31Bc65'
    };

    // Store contract addresses for future use
    this.contractAddresses = contracts;
  }

  // Get provider
  getProvider() {
    return this.provider;
  }

  // Validate ethereum address
  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash) {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      throw error;
    }
  }

  // Get block information
  async getBlock(blockNumber) {
    try {
      return await this.provider.getBlock(blockNumber);
    } catch (error) {
      console.error('Error getting block:', error);
      throw error;
    }
  }

  // Get account balance
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  // Verify signature
  verifySignature(message, signature, address) {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  // Mock disaster data for API responses
  getMockDisasters() {
    return [
      {
        id: 1,
        name: 'Turkey Earthquake Relief',
        location: 'Kahramanmaraş, Turkey',
        description: 'Emergency aid for earthquake victims in southern Turkey',
        latitude: 37.5858,
        longitude: 36.9371,
        raised: 125000,
        target: 200000,
        distributed: 98000,
        beneficiaries: 2500,
        status: 'active',
        urgency: 'high',
        severity: 'critical',
        category: 'earthquake',
        verified: true,
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString(),
        endDate: new Date('2024-03-15').toISOString(),
        government_verified: true,
        treasury_allocated: true,
        oracle_validated: true
      },
      {
        id: 2,
        name: 'Pacific Wildfire Response',
        location: 'California, USA',
        description: 'Emergency relief for wildfire evacuees and affected communities',
        latitude: 34.0522,
        longitude: -118.2437,
        raised: 89000,
        target: 150000,
        distributed: 67000,
        beneficiaries: 1200,
        status: 'active',
        urgency: 'medium',
        severity: 'high',
        category: 'wildfire',
        verified: true,
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-05').toISOString(),
        endDate: new Date('2024-04-01').toISOString(),
        government_verified: true,
        treasury_allocated: false,
        oracle_validated: true
      },
      {
        id: 3,
        name: 'Bangladesh Flood Relief',
        location: 'Sylhet, Bangladesh',
        description: 'Monsoon flood relief for displaced families',
        latitude: 24.8949,
        longitude: 91.8687,
        raised: 45000,
        target: 100000,
        distributed: 32000,
        beneficiaries: 800,
        status: 'active',
        urgency: 'high',
        severity: 'moderate',
        category: 'flood',
        verified: true,
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-02-12').toISOString(),
        endDate: new Date('2024-05-10').toISOString(),
        government_verified: false,
        treasury_allocated: true,
        oracle_validated: false
      }
    ];
  }

  // Mock vendor data
  getMockVendors() {
    return [
      {
        id: 1,
        address: '0x742d35Cc6634C0532925a3b8D6C4B98A15B56D0',
        name: 'Relief Supplies Inc',
        email: 'contact@reliefsupplies.com',
        phone: '+1-555-0123',
        location: 'Turkey',
        verified: true,
        category: 'food',
        reputation: 4.8,
        totalTransactions: 156,
        activeZones: [1, 2],
        registeredAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 2,
        address: '0x8ba1f109551bD432803012645Hac136c5cd52dd73',
        name: 'Emergency Medical Services',
        email: 'help@emergencymed.org',
        phone: '+1-555-0456',
        location: 'California, USA',
        verified: true,
        category: 'medical',
        reputation: 4.9,
        totalTransactions: 89,
        activeZones: [2],
        registeredAt: new Date('2024-01-15').toISOString()
      }
    ];
  }

  // Mock voucher data
  getMockVouchers() {
    return [
      {
        id: 1,
        voucherId: 'VCH-001-2024',
        recipient: '0x1234567890abcdef1234567890abcdef12345678',
        amount: 100,
        currency: 'USDC',
        status: 'active',
        disasterId: 1,
        vendorId: 1,
        category: 'food',
        expiresAt: new Date('2024-03-15').toISOString(),
        createdAt: new Date('2024-01-20').toISOString(),
        redeemedAt: null,
        metadata: {
          emergencyLevel: 'high',
          familySize: 4,
          specialNeeds: ['medical', 'infant']
        }
      },
      {
        id: 2,
        voucherId: 'VCH-002-2024',
        recipient: '0xabcdef1234567890abcdef1234567890abcdef12',
        amount: 75,
        currency: 'USDC',
        status: 'redeemed',
        disasterId: 1,
        vendorId: 1,
        category: 'medical',
        expiresAt: new Date('2024-03-15').toISOString(),
        createdAt: new Date('2024-01-22').toISOString(),
        redeemedAt: new Date('2024-01-23').toISOString(),
        metadata: {
          emergencyLevel: 'critical',
          familySize: 2,
          specialNeeds: ['elderly']
        }
      }
    ];
  }

  // Mock transaction data
  getMockTransactions() {
    return [
      {
        id: 1,
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: '0x742d35Cc6634C0532925a3b8D6C4B98A15B56D0',
        to: '0x1234567890abcdef1234567890abcdef12345678',
        amount: 100,
        currency: 'USDC',
        type: 'voucher_redemption',
        status: 'confirmed',
        blockNumber: 12345678,
        gasUsed: 21000,
        gasPrice: '20000000000',
        timestamp: new Date('2024-01-23').toISOString(),
        disasterId: 1,
        voucherId: 1,
        metadata: {
          items: ['Rice 10kg', 'Oil 2L', 'Sugar 1kg'],
          vendorName: 'Relief Supplies Inc'
        }
      }
    ];
  }
}

// Create and export singleton
const blockchainService = new BlockchainService();
module.exports = blockchainService;
